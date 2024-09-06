import createApi from "@italodeandra/next/api/createApi";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { notFound, unauthorized } from "@italodeandra/next/api/errors";
import { connectDb } from "../../../../db";
import getBoard from "../../../../collections/board";
import getTeam from "../../../../collections/team";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import asyncMap from "@italodeandra/next/utils/asyncMap";
import getUser from "@italodeandra/auth/collections/user/User";
import getProject from "../../../../collections/project";
import getSubProject from "../../../../collections/subProject";

export const subProjectPermissionsListApi = createApi(
  "/api/sub-project/permissions/list",
  async (args: { subProjectId: string }, req, res) => {
    await connectDb();
    const Board = getBoard();
    const Project = getProject();
    const SubProject = getSubProject();
    const Team = getTeam();
    const User = getUser();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }
    const userTeams = await Team.find(
      { "members.userId": { $in: [user._id] } },
      { projection: { _id: 1 } },
    );
    const userTeamsIds = userTeams.map((t) => t._id);
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
        projection: {
          permissions: 1,
          projectId: 1,
        },
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
        projection: {
          boardId: 1,
        },
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

    return asyncMap(
      subProject.permissions,
      async ({ userId, teamId, ...permission }) => ({
        ...permission,
        user: userId
          ? {
              ...(await User.findById(userId, {
                projection: { name: 1, email: 1 },
              }))!,
              isMe: userId?.equals(user._id),
            }
          : undefined,
        team: teamId
          ? await Team.findById(teamId, { projection: { name: 1 } })
          : undefined,
      }),
    );
  },
  {
    queryKeyMap: (args) => [args?.subProjectId],
  },
);

export default subProjectPermissionsListApi.handler;
