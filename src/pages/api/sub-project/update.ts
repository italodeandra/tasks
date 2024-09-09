import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import createApi from "@italodeandra/next/api/createApi";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import getSubProject, { ISubProject } from "../../../collections/subProject";
import { projectListWithSubProjectsApi } from "../project/list-with-sub-projects";
import { PermissionLevel } from "../../../collections/permission";
import getBoard from "../../../collections/board";
import getTeam from "../../../collections/team";
import getProject from "../../../collections/project";
import { taskListApi } from "../task/list";
import { boardState } from "../../../views/board/board.state";

export const subProjectUpdateApi = createApi(
  "/api/sub-project/update",
  async function (
    args: Jsonify<Pick<ISubProject, "_id" | "name" | "projectId">>,
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    await connectDb();
    const SubProject = getSubProject();
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

    await SubProject.updateOne(
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
      async onSuccess(data, _v, _c, queryClient) {
        await projectListWithSubProjectsApi.invalidateQueries(
          queryClient,
          data,
        );
        await taskListApi.invalidateQueries(queryClient, {
          ...data,
          selectedProjects: boardState.selectedProjects,
          selectedSubProjects: boardState.selectedSubProjects,
        });
      },
    },
  },
);

export default subProjectUpdateApi.handler;
