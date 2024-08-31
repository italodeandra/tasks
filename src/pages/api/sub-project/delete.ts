import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import createApi from "@italodeandra/next/api/createApi";
import getSubProject, { ISubProject } from "../../../collections/subProject";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { projectListWithSubProjectsApi } from "../project/list-with-sub-projects";
import getTask from "../../../collections/task";
import { PermissionLevel } from "../../../collections/permission";
import getBoard from "../../../collections/board";
import getTeam from "../../../collections/team";
import getProject from "../../../collections/project";

export const subProjectDeleteApi = createApi(
  "/api/sub-project/delete",
  async function (
    args: Jsonify<Pick<ISubProject, "_id" | "projectId">>,
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    await connectDb();
    const SubProject = getSubProject();
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

    const projectId = isomorphicObjectId(args.projectId);

    const boardId = (
      await Project.findOne(
        {
          _id: projectId,
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

    if (!(await Task.countDocuments({ subProjectId: _id }))) {
      await SubProject.deleteOne(filter);
    } else {
      await SubProject.updateOne(filter, {
        $set: {
          archived: true,
        },
      });
    }

    await Project.updateOne(
      {
        _id: projectId,
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
        void projectListWithSubProjectsApi.invalidateQueries(queryClient, data);
      },
    },
  },
);

export default subProjectDeleteApi.handler;
