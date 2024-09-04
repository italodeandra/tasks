import createApi from "@italodeandra/next/api/createApi";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { connectDb } from "../../../db";
import getSubProject, { ISubProject } from "../../../collections/subProject";
import getTeam from "../../../collections/team";
import getProject, { IProject } from "../../../collections/project";
import getBoard from "../../../collections/board";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
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

    return Project.aggregate<
      Pick<IProject, "_id" | "name"> & {
        subProjects: (Pick<ISubProject, "_id" | "name"> & {
          canEdit: boolean;
        })[];
        canEdit: boolean;
      }
    >([
      {
        $match: {
          archived: {
            $ne: true,
          },
          boardId,
        },
      },
      {
        $lookup: {
          from: Board.collection.collectionName,
          localField: "boardId",
          foreignField: "_id",
          as: "board",
          pipeline: [
            {
              $project: {
                permissions: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: "$board",
      },
      {
        $match: {
          $and: [
            {
              $or: [
                ...(user
                  ? [
                      {
                        "board.permissions.userId": {
                          $in: [user._id],
                        },
                      },
                      {
                        "board.permissions.teamId": {
                          $in: userTeamsIds,
                        },
                      },
                    ]
                  : []),
                {
                  "board.permissions.public": true,
                },
              ],
            },
            {
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
          ],
        },
      },
      {
        $addFields: {
          canEdit: user?._id
            ? {
                $or: [
                  {
                    $in: [
                      user._id,
                      {
                        $ifNull: [
                          {
                            $map: {
                              input: {
                                $filter: {
                                  input: "$permissions",
                                  as: "perm",
                                  cond: {
                                    $eq: [
                                      "$$perm.level",
                                      PermissionLevel.ADMIN,
                                    ],
                                  },
                                },
                              },
                              as: "perm",
                              in: "$$perm.userId",
                            },
                          },
                          [],
                        ],
                      },
                    ],
                  },
                  {
                    $in: [
                      user._id,
                      {
                        $ifNull: [
                          {
                            $map: {
                              input: {
                                $filter: {
                                  input: "$board.permissions",
                                  as: "perm",
                                  cond: {
                                    $eq: [
                                      "$$perm.level",
                                      PermissionLevel.ADMIN,
                                    ],
                                  },
                                },
                              },
                              as: "perm",
                              in: "$$perm.userId",
                            },
                          },
                          [],
                        ],
                      },
                    ],
                  },
                ],
              }
            : { $literal: false },
        },
      },
      {
        $lookup: {
          from: SubProject.collection.collectionName,
          localField: "_id",
          foreignField: "projectId",
          as: "subProjects",
          let: {
            canEditProject: "$canEdit",
          },
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
                canEdit: user?._id
                  ? {
                      $or: [
                        {
                          $in: [
                            user._id,
                            {
                              $ifNull: [
                                {
                                  $map: {
                                    input: {
                                      $filter: {
                                        input: "$permissions",
                                        as: "permUsers",
                                        cond: {
                                          $and: [
                                            {
                                              $ne: [
                                                { $type: "$$permUsers.userId" },
                                                "missing",
                                              ],
                                            },
                                            {
                                              $eq: [
                                                "$$permUsers.level",
                                                PermissionLevel.ADMIN,
                                              ],
                                            },
                                          ],
                                        },
                                      },
                                    },
                                    as: "permUsers",
                                    in: "$$permUsers.userId",
                                  },
                                },
                                [],
                              ],
                            },
                          ],
                        },
                        {
                          $setIsSubset: [
                            userTeamsIds,
                            {
                              $ifNull: [
                                {
                                  $map: {
                                    input: {
                                      $filter: {
                                        input: "$permissions",
                                        as: "permTeams",
                                        cond: {
                                          $and: [
                                            {
                                              $ne: [
                                                { $type: "$$permTeams.teamId" },
                                                "missing",
                                              ],
                                            },
                                            {
                                              $eq: [
                                                "$$permTeams.level",
                                                PermissionLevel.ADMIN,
                                              ],
                                            },
                                          ],
                                        },
                                      },
                                    },
                                    as: "permTeams",
                                    in: "$$permTeams.teamId",
                                  },
                                },
                                [],
                              ],
                            },
                          ],
                        },
                        {
                          $eq: ["$$canEditProject", true],
                        },
                      ],
                    }
                  : { $literal: false },
                rootEdit: "$$ROOT.canEdit",
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
          subProjects: 1,
          canEdit: 1,
        },
      },
    ]);
  },
  {
    queryKeyMap: (args) => [args?.boardId],
  },
);

export default projectListWithSubProjectsApi.handler;
