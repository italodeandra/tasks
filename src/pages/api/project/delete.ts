import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { notFound, unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import createApi from "@italodeandra/next/api/createApi";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import getTask from "../../../collections/task";
import { PermissionLevel } from "../../../collections/permission";
import getBoard from "../../../collections/board";
import getTeam from "../../../collections/team";
import getProject from "../../../collections/project";
import { projectListWithSubProjectsApi } from "./list-with-sub-projects";

export const projectDeleteApi = createApi(
  "/api/project/delete",
  async function (
    args: { _id: string },
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    await connectDb();
    const Task = getTask();
    const Board = getBoard();
    const Team = getTeam();
    const Project = getProject();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const userTeams = await Team.find(
      { "members.userId": { $in: [user._id] } },
      { projection: { _id: 1 } },
    );
    const userTeamsIds = userTeams.map((t) => t._id);

    const _id = isomorphicObjectId(args._id);

    const boardId = (
      await Project.findOne(
        {
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
        },
        { projection: { boardId: 1 } },
      )
    )?.boardId;

    const haveAccessToAdminProject =
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
    if (!haveAccessToAdminProject) {
      throw notFound;
    }

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

    return {
      boardId,
    };
  },
  {
    mutationOptions: {
      onSuccess(data, _v, _c, queryClient) {
        void projectListWithSubProjectsApi.invalidateQueries(queryClient, data);
      },
    },
  },
);

export default projectDeleteApi.handler;
