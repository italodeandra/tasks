import createApi from "@italodeandra/next/api/createApi";
import { connectDb } from "../../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { notFound, unauthorized } from "@italodeandra/next/api/errors";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import getBoard from "../../../../collections/board";
import { PermissionLevel } from "../../../../collections/permission";
import { subProjectPermissionsListApi } from "./list";
import getProject from "../../../../collections/project";
import getTeam from "../../../../collections/team";
import getSubProject from "../../../../collections/subProject";
import { projectListWithSubProjectsApi } from "../../project/list-with-sub-projects";

export const subProjectPermissionsInviteTeamApi = createApi(
  "/api/sub-project/permissions/invite-team",
  async (args: { subProjectId: string; teamId: string }, req, res) => {
    await connectDb();
    const Board = getBoard();
    const Project = getProject();
    const SubProject = getSubProject();
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
    const subProjectId = isomorphicObjectId(args.subProjectId);

    const subProject = await SubProject.findOne(
      {
        _id: subProjectId,
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
        projection: { projectId: 1 },
      },
    );
    if (!subProject) {
      throw notFound;
    }

    const project = await Project.findOne(
      {
        _id: subProject.projectId,
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

    await SubProject.updateOne(
      {
        _id: subProjectId,
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
      onSuccess(data, variables, _c, queryClient) {
        void projectListWithSubProjectsApi.invalidateQueries(queryClient, data);
        void subProjectPermissionsListApi.invalidateQueries(
          queryClient,
          variables,
        );
      },
    },
  },
);

export default subProjectPermissionsInviteTeamApi.handler;
