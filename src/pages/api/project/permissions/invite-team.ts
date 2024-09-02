import createApi from "@italodeandra/next/api/createApi";
import { connectDb } from "../../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { notFound, unauthorized } from "@italodeandra/next/api/errors";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import getBoard from "../../../../collections/board";
import { PermissionLevel } from "../../../../collections/permission";
import { projectPermissionsListApi } from "./list";
import getProject from "../../../../collections/project";
import getTeam from "../../../../collections/team";
import { projectListWithSubProjectsApi } from "../list-with-sub-projects";

export const projectPermissionsInviteTeamApi = createApi(
  "/api/project/permissions/invite-team",
  async (args: { projectId: string; teamId: string }, req, res) => {
    await connectDb();
    const Board = getBoard();
    const Project = getProject();
    const Team = getTeam();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const userTeams = await Team.find(
      { "members.userId": { $in: [user._id] } },
      { projection: { _id: 1 } },
    );
    const userTeamsIds = userTeams.map((t) => t._id);

    const teamId = isomorphicObjectId(args.teamId);
    const projectId = isomorphicObjectId(args.projectId);

    const project = await Project.findOne(
      {
        _id: projectId,
        $or: [
          {
            permissions: {
              $exists: false,
            },
          },
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
      },
      {
        projection: { boardId: 1 },
      },
    );
    if (!project) {
      throw notFound;
    }

    const hasAccessToBoard = await Board.countDocuments({
      _id: project.boardId,
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
    if (!hasAccessToBoard) {
      throw notFound;
    }

    await Project.updateOne(
      {
        _id: projectId,
      },
      {
        $addToSet: {
          permissions: {
            teamId,
            level: PermissionLevel.READ,
          },
        },
      },
    );

    return {
      boardId: project.boardId,
    };
  },
  {
    mutationOptions: {
      async onSuccess(data, variables, _c, queryClient) {
        void projectListWithSubProjectsApi.invalidateQueries(queryClient, data);
        await projectPermissionsListApi.invalidateQueries(
          queryClient,
          variables,
        );
      },
    },
  },
);

export default projectPermissionsInviteTeamApi.handler;
