import createApi from "@italodeandra/next/api/createApi";
import { unauthorized } from "@italodeandra/next/api/errors";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { connectDb } from "../../../db";
import getSubProject, { ISubProject } from "../../../collections/subProject";
import getTeam from "../../../collections/team";
import getProject, { IProject } from "../../../collections/project";
import getBoard from "../../../collections/board";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import asyncMap from "@italodeandra/next/utils/asyncMap";
import { PermissionLevel } from "../../../collections/permission";

export const projectListWithSubProjectsApi = createApi(
  "/api/project/list-with-sub-projects",
  async (args: { boardId: string }, req, res) => {
    await connectDb();
    const Project = getProject();
    const SubProject = getSubProject();
    const Team = getTeam();
    const Board = getBoard();
    const user = await getUserFromCookies(req, res);

    const userTeams = user
      ? await Team.find(
          { "members.userId": { $in: [user._id] } },
          { projection: { _id: 1 } },
        )
      : undefined;
    const userTeamsIds = userTeams?.map((t) => t._id);
    const boardId = isomorphicObjectId(args.boardId);

    const haveAccessToReadBoard = await Board.countDocuments({
      _id: boardId,
      $or: [
        ...(user
          ? [
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
            ]
          : []),
        {
          "permissions.public": true,
        },
      ],
    });
    if (!haveAccessToReadBoard) {
      throw unauthorized;
    }

    const projects = await Project.aggregate<
      Pick<IProject, "_id" | "name" | "permissions"> & {
        subProjects: Pick<ISubProject, "_id" | "name" | "permissions">[];
      }
    >([
      {
        $match: {
          archived: {
            $ne: true,
          },
          boardId,
          $or: [
            {
              permissions: {
                $exists: false,
              },
            },
            ...(user
              ? [
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
                ]
              : []),
            {
              "permissions.public": true,
            },
          ],
        },
      },
      {
        $lookup: {
          from: SubProject.collection.collectionName,
          localField: "_id",
          foreignField: "projectId",
          as: "subProjects",
          pipeline: [
            {
              $match: {
                archived: { $ne: true },
                $or: [
                  {
                    permissions: {
                      $exists: false,
                    },
                  },
                  ...(user
                    ? [
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
                      ]
                    : []),
                  {
                    "permissions.public": true,
                  },
                ],
              },
            },
            {
              $sort: {
                updatedAt: -1,
              },
            },
            {
              $project: {
                name: 1,
                permissions: 1,
              },
            },
          ],
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
      {
        $project: {
          name: 1,
          permissions: 1,
          subProjects: 1,
        },
      },
    ]);

    return asyncMap(
      projects,
      async ({ permissions, subProjects, ...project }) => ({
        ...project,
        canEdit:
          (user && !permissions) ||
          permissions?.some((p) => p.level === PermissionLevel.ADMIN),
        subProjects: subProjects.map(({ permissions, ...subProject }) => ({
          ...subProject,
          canEdit:
            !permissions ||
            permissions.some((p) => p.level === PermissionLevel.ADMIN),
        })),
      }),
    );
  },
  {
    queryKeyMap: (args) => [args?.boardId],
  },
);

export default projectListWithSubProjectsApi.handler;
