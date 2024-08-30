import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import createApi from "@italodeandra/next/api/createApi";
import getClient, { IClient } from "../../../collections/client";
import { clientListWithProjectsApi } from "./list-with-projects";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import getBoard from "../../../collections/board";
import { PermissionLevel } from "../../../collections/permission";
import getTeam from "../../../collections/team";

export const clientCreateApi = createApi(
  "/api/client/create",
  async function (
    args: Jsonify<Pick<IClient, "name" | "boardId">>,
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    await connectDb();
    const Client = getClient();
    const Board = getBoard();
    const Team = getTeam();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const userTeams = await Team.find(
      { members: { $in: [user._id] } },
      { projection: { _id: 1 } },
    );
    const userTeamsIds = userTeams.map((t) => t._id);
    const boardId = isomorphicObjectId(args.boardId);

    const haveAccessToAdminBoard = await Board.countDocuments({
      _id: boardId,
      "permissions.level": {
        $in: [PermissionLevel.ADMIN],
      },
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
    if (!haveAccessToAdminBoard) {
      throw unauthorized;
    }

    await Client.insertOne({
      name: args.name,
      boardId: isomorphicObjectId(args.boardId),
    });
  },
  {
    mutationOptions: {
      onSuccess(_d, variables, _c, queryClient) {
        void clientListWithProjectsApi.invalidateQueries(
          queryClient,
          variables,
        );
      },
    },
  },
);

export default clientCreateApi.handler;
