import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import createApi from "@italodeandra/next/api/createApi";
import getProject, { IProject } from "../../../collections/project";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { clientListWithProjectsApi } from "../client/list-with-projects";
import getClient from "../../../collections/client";
import { PermissionLevel } from "../../../collections/permission";
import getBoard from "../../../collections/board";
import getTeam from "../../../collections/team";

export const projectCreateApi = createApi(
  "/api/project/create",
  async function (
    args: Jsonify<Pick<IProject, "name" | "clientId">>,
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    await connectDb();
    const Project = getProject();
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

    await Project.insertOne({
      name: args.name,
      clientId,
    });

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

export default projectCreateApi.handler;
