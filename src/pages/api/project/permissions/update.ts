import { connectDb } from "../../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { notFound, unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import createApi from "@italodeandra/next/api/createApi";
import getTeam from "../../../../collections/team";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { projectPermissionsListApi } from "./list";
import getBoard from "../../../../collections/board";
import { PermissionLevel } from "../../../../collections/permission";
import getProject from "../../../../collections/project";
import { projectListWithSubProjectsApi } from "../list-with-sub-projects";

export const projectPermissionsUpdateApi = createApi(
  "/api/project/permissions/update",
  async function (
    args: {
      projectId: string;
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
        projection: { boardId: 1, permissions: 1 },
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

    let projectPermissions = project.permissions;
    if (projectPermissions) {
      if (userId || teamId) {
        projectPermissions = projectPermissions
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
        if (projectPermissions.some((p) => p.public)) {
          if (!args.public) {
            projectPermissions = projectPermissions.filter(
              (p) => p.public === undefined,
            );
          }
        } else if (args.level !== "remove") {
          projectPermissions.push({
            public: args.public,
            level: args.level,
          });
        }
      }
    }

    await Project.updateOne(
      {
        _id: projectId,
      },
      {
        $set: {
          permissions: projectPermissions,
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
        void projectPermissionsListApi.invalidateQueries(
          queryClient,
          variables,
        );
      },
    },
  },
);

export default projectPermissionsUpdateApi.handler;
