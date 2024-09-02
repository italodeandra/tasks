import { connectDb } from "../../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { notFound, unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import createApi from "@italodeandra/next/api/createApi";
import getTeam from "../../../../collections/team";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { subProjectPermissionsListApi } from "./list";
import getBoard from "../../../../collections/board";
import { PermissionLevel } from "../../../../collections/permission";
import getProject from "../../../../collections/project";
import getSubProject from "../../../../collections/subProject";
import { projectListWithSubProjectsApi } from "../../project/list-with-sub-projects";

export const subProjectPermissionsUpdateApi = createApi(
  "/api/sub-project/permissions/update",
  async function (
    args: {
      subProjectId: string;
      userId?: string;
      teamId?: string;
      public?: boolean;
      level: PermissionLevel | "remove";
    },
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    await connectDb();
    const Team = getTeam();
    const Project = getProject();
    const SubProject = getSubProject();
    const Board = getBoard();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const userId = args.userId ? isomorphicObjectId(args.userId) : undefined;
    const teamId = args.teamId ? isomorphicObjectId(args.teamId) : undefined;

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
        projection: { projectId: 1, permissions: 1 },
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

    let subProjectPermissions = subProject.permissions;
    if (subProjectPermissions) {
      if (userId || teamId) {
        subProjectPermissions = subProjectPermissions
          .filter(
            (permission) =>
              !userId ||
              !permission.userId?.equals(userId) ||
              args.level !== "remove",
          )
          .filter(
            (permission) =>
              !teamId ||
              !permission.teamId?.equals(teamId) ||
              args.level !== "remove",
          )
          .map((permission) => {
            if (
              (userId && permission.userId?.equals(userId)) ||
              (teamId && permission.teamId?.equals(teamId))
            ) {
              return {
                ...permission,
                level: args.level as PermissionLevel,
              };
            }
            return permission;
          });
      }
      if (args.public !== undefined) {
        if (subProjectPermissions.some((p) => p.public)) {
          if (!args.public) {
            subProjectPermissions = subProjectPermissions.filter(
              (p) => p.public === undefined,
            );
          }
        } else if (args.level !== "remove") {
          subProjectPermissions.push({
            public: args.public,
            level: args.level,
          });
        }
      }
    }

    await SubProject.updateOne(
      {
        _id: subProjectId,
      },
      {
        $set: {
          permissions: subProjectPermissions,
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
        await subProjectPermissionsListApi.invalidateQueries(
          queryClient,
          variables,
        );
      },
    },
  },
);

export default subProjectPermissionsUpdateApi.handler;
