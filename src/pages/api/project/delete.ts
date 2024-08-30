import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import createApi from "@italodeandra/next/api/createApi";
import getProject, { IProject } from "../../../collections/project";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { clientListWithProjectsApi } from "../client/list-with-projects";
import getTask from "../../../collections/task";
import { PermissionLevel } from "../../../collections/permission";
import getBoard from "../../../collections/board";
import getTeam from "../../../collections/team";
import getClient from "../../../collections/client";

export const projectDeleteApi = createApi(
  "/api/project/delete",
  async function (
    args: Jsonify<Pick<IProject, "_id" | "clientId">>,
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    await connectDb();
    const Project = getProject();
    const Task = getTask();
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

    const _id = isomorphicObjectId(args._id);

    const filter = {
      _id,
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
    };

    if (!(await Task.countDocuments({ projectId: _id }))) {
      await Project.deleteOne(filter);
    } else {
      await Project.updateOne(filter, {
        $set: {
          archived: true,
        },
      });
    }

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

export default projectDeleteApi.handler;
