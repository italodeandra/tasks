import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import createApi from "@italodeandra/next/api/createApi";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import getProject, { IProject } from "../../../collections/project";
import { clientListWithProjectsApi } from "../client/list-with-projects";
import { PermissionLevel } from "../../../collections/permission";
import getBoard from "../../../collections/board";
import getTeam from "../../../collections/team";
import getClient from "../../../collections/client";

export const projectUpdateApi = createApi(
  "/api/project/update",
  async function (
    args: Jsonify<Pick<IProject, "_id" | "name" | "clientId">>,
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    await connectDb();
    const Project = getProject();
    const Board = getBoard();
    const Team = getTeam();
    const Client = getClient();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const userTeams = await Team.find(
      { members: { $in: [user._id] } },
      { projection: { _id: 1 } },
    );
    const userTeamsIds = userTeams.map((t) => t._id);

    const clientId = isomorphicObjectId(args.clientId);

    const boardId = (
      await Client.findOne(
        {
          _id: clientId,
          $or: [
            {
              permissions: {
                $exists: false,
              },
            },
            {
              "permissions.level": {
                $in: [PermissionLevel.ADMIN],
              },
              "permissions.userId": {
                $in: [user._id],
              },
            },
            {
              "permissions.level": {
                $in: [PermissionLevel.ADMIN],
              },
              "permissions.teamId": {
                $in: userTeamsIds,
              },
            },
          ],
        },
        { projection: { boardId: 1 } },
      )
    )?.boardId;

    const haveAccessToAdminClient =
      boardId &&
      (await Board.countDocuments({
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
      }));
    if (!haveAccessToAdminClient) {
      throw unauthorized;
    }

    await Project.updateOne(
      {
        _id: isomorphicObjectId(args._id),
        $or: [
          {
            permissions: {
              $exists: false,
            },
          },
          {
            "permissions.level": {
              $in: [PermissionLevel.ADMIN],
            },
            "permissions.userId": {
              $in: [user._id],
            },
          },
          {
            "permissions.level": {
              $in: [PermissionLevel.ADMIN],
            },
            "permissions.teamId": {
              $in: userTeamsIds,
            },
          },
        ],
      },
      {
        $set: {
          name: args.name,
        },
      },
    );

    await Client.updateOne(
      {
        _id: clientId,
      },
      {
        $set: {},
      },
    );

    return {
      boardId,
    };
  },
  {
    mutationOptions: {
      onSuccess(data, _v, _c, queryClient) {
        void clientListWithProjectsApi.invalidateQueries(queryClient, data);
      },
    },
  },
);

export default projectUpdateApi.handler;
