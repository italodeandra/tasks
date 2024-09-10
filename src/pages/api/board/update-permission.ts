import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import createApi from "@italodeandra/next/api/createApi";
import getTeam from "../../../collections/team";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { boardGetApi } from "./get";
import { boardGetPermissionsApi } from "./get-permissions";
import getBoard from "../../../collections/board";
import { PermissionLevel } from "../../../collections/permission";

export const boardUpdatePermissionApi = createApi(
  "/api/board/update-permission",
  async function (
    args: {
      boardId: string;
      userId?: string;
      teamId?: string;
      public?: boolean;
      level: PermissionLevel | "remove";
    },
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    await connectDb();
    const Team = getTeam();
    const Board = getBoard();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const boardId = isomorphicObjectId(args.boardId);
    const userId = args.userId ? isomorphicObjectId(args.userId) : undefined;
    const teamId = args.teamId ? isomorphicObjectId(args.teamId) : undefined;

    const userTeams = await Team.find(
      { "members.userId": { $in: [user._id] } },
      { projection: { _id: 1 } },
    );
    const userTeamsIds = userTeams.map((t) => t._id);

    const canEditBoard = await Board.countDocuments({
      _id: boardId,
      $or: [
        {
          "permissions.userId": {
            $in: [user._id],
          },
        },
        {
          "permissions.teamId": {
            $in: userTeamsIds,
          },
        },
      ],
    });

    if (!canEditBoard) {
      throw unauthorized;
    }

    const board = (await Board.findById(boardId, {
      projection: { permissions: 1 },
    }))!;

    let boardPermissions = board.permissions;
    if (userId || teamId) {
      boardPermissions = board.permissions
        .filter(
          (permission) =>
            !userId ||
            !permission.userId?.equals(userId) ||
            args.level !== "remove",
        )
        .filter(
          (permission) =>
            !teamId ||
            !permission.teamId?.equals(teamId) ||
            args.level !== "remove",
        )
        .map((permission) => {
          if (
            (userId && permission.userId?.equals(userId)) ||
            (teamId && permission.teamId?.equals(teamId))
          ) {
            return {
              ...permission,
              level: args.level as PermissionLevel,
            };
          }
          return permission;
        });
    }
    if (args.public !== undefined) {
      if (boardPermissions.some((p) => p.public)) {
        if (!args.public) {
          boardPermissions = boardPermissions.filter(
            (p) => p.public === undefined,
          );
        }
      } else if (args.level !== "remove") {
        boardPermissions.push({
          public: args.public,
          level: args.level,
        });
      }
    }

    await Board.updateOne(
      {
        _id: boardId,
      },
      {
        $set: {
          permissions: boardPermissions,
        },
      },
    );
  },
  {
    mutationOptions: {
      onSuccess(_d, variables, _c, queryClient) {
        void boardGetApi.invalidateQueries(queryClient, {
          _id: variables.boardId,
        });
        void boardGetPermissionsApi.invalidateQueries(queryClient, {
          _id: variables.boardId,
        });
      },
    },
  },
);

export default boardUpdatePermissionApi.handler;
