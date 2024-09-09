import createApi from "@italodeandra/next/api/createApi";
import { notFound } from "@italodeandra/next/api/errors";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import getTask, { ITask } from "../../../collections/task";
import { connectDb } from "../../../db";
import getTaskColumn from "../../../collections/taskColumn";
import getTeam from "../../../collections/team";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import getBoard from "../../../collections/board";
import getUser, { IUser } from "@italodeandra/auth/collections/user/User";
import getProject from "../../../collections/project";
import getSubProject from "../../../collections/subProject";
import { PermissionLevel } from "../../../collections/permission";

export const taskGetApi = createApi(
  "/api/task/get",
  async (args: { _id: string }, req, res) => {
    await connectDb();
    const Task = getTask();
    const TaskColumn = getTaskColumn();
    const Team = getTeam();
    const Board = getBoard();
    const User = getUser();
    const Project = getProject();
    const SubProject = getSubProject();
    const user = await getUserFromCookies(req, res);

    const _id = isomorphicObjectId(args._id);

    const userTeams = user
      ? await Team.find(
          { "members.userId": { $in: [user._id] } },
          { projection: { _id: 1 } },
        )
      : undefined;
    const userTeamsIds = userTeams?.map((t) => t._id);

    const task = (
      await Task.aggregate<
        Pick<
          ITask,
          | "_id"
          | "title"
          | "columnId"
          | "description"
          | "statusId"
          | "projectId"
          | "subProjectId"
          | "secondaryProjectsIds"
        > & {
          canEdit: boolean;
          canComment: boolean;
          assignees: (Pick<
            IUser,
            "_id" | "name" | "email" | "profilePicture"
          > & {
            isMe: boolean;
          })[];
        }
      >([
        {
          $match: {
            _id,
            archived: { $ne: true },
          },
        },
        {
          $lookup: {
            from: Project.collection.collectionName,
            localField: "projectId",
            foreignField: "_id",
            as: "project",
            pipeline: [
              {
                $project: {
                  archived: 1,
                  permissions: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$project",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: SubProject.collection.collectionName,
            localField: "subProjectId",
            foreignField: "_id",
            as: "subProject",
            pipeline: [
              {
                $project: {
                  archived: 1,
                  permissions: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$subProject",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: TaskColumn.collection.collectionName,
            localField: "columnId",
            foreignField: "_id",
            as: "column",
            pipeline: [
              {
                $project: {
                  boardId: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: "$column",
        },
        {
          $lookup: {
            from: Board.collection.collectionName,
            localField: "column.boardId",
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
            "project.archived": { $ne: true },
            "subProject.archived": { $ne: true },
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
                    "project.permissions": {
                      $exists: false,
                    },
                  },
                  ...(user
                    ? [
                        {
                          "project.permissions.userId": {
                            $in: [user._id],
                          },
                        },
                        {
                          "project.permissions.teamId": {
                            $in: userTeamsIds,
                          },
                        },
                      ]
                    : []),
                  {
                    "project.permissions.public": true,
                  },
                ],
              },
              {
                $or: [
                  {
                    "subProject.permissions": {
                      $exists: false,
                    },
                  },
                  ...(user
                    ? [
                        {
                          "subProject.permissions.userId": {
                            $in: [user._id],
                          },
                        },
                        {
                          "subProject.permissions.teamId": {
                            $in: userTeamsIds,
                          },
                        },
                      ]
                    : []),
                  {
                    "subProject.permissions.public": true,
                  },
                ],
              },
            ],
          },
        },
        {
          $lookup: {
            from: User.collection.collectionName,
            localField: "assignees",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  name: 1,
                  email: 1,
                  profilePicture: 1,
                  isMe: {
                    $cond: {
                      if: { $eq: ["$_id", user?._id] },
                      then: true,
                      else: false,
                    },
                  },
                },
              },
            ],
            as: "assignees",
          },
        },
        {
          $project: {
            canEdit: user?._id
              ? {
                  $or: [
                    {
                      $in: [
                        user._id,
                        {
                          $map: {
                            input: {
                              $filter: {
                                input: "$board.permissions",
                                as: "boardPermUsers",
                                cond: {
                                  $in: [
                                    "$$boardPermUsers.level",
                                    [
                                      PermissionLevel.ADMIN,
                                      PermissionLevel.WRITE,
                                    ],
                                  ],
                                },
                              },
                            },
                            as: "boardPermUsers",
                            in: "$$boardPermUsers.userId",
                          },
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
                                    input: "$project.permissions",
                                    as: "projectPermUsers",
                                    cond: {
                                      $in: [
                                        "$$projectPermUsers.level",
                                        [
                                          PermissionLevel.ADMIN,
                                          PermissionLevel.WRITE,
                                        ],
                                      ],
                                    },
                                  },
                                },
                                as: "projectPermUsers",
                                in: "$$projectPermUsers.userId",
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
                                    input: "$subProject.permissions",
                                    as: "subProjectsPermUsers",
                                    cond: {
                                      $in: [
                                        "$$subProjectsPermUsers.level",
                                        [
                                          PermissionLevel.ADMIN,
                                          PermissionLevel.WRITE,
                                        ],
                                      ],
                                    },
                                  },
                                },
                                as: "subProjectsPermUsers",
                                in: "$$subProjectsPermUsers.userId",
                              },
                            },
                            [],
                          ],
                        },
                      ],
                    },
                    ...(userTeamsIds?.length
                      ? [
                          {
                            $setIsSubset: [
                              userTeamsIds,
                              {
                                $ifNull: [
                                  {
                                    $map: {
                                      input: {
                                        $filter: {
                                          input: "$board.permissions",
                                          as: "boardPermTeams",
                                          cond: {
                                            $in: [
                                              "$$boardPermTeams.level",
                                              [
                                                PermissionLevel.ADMIN,
                                                PermissionLevel.WRITE,
                                              ],
                                            ],
                                          },
                                        },
                                      },
                                      as: "boardPermTeams",
                                      in: "$$boardPermTeams.teamId",
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
                                          input: "$project.permissions",
                                          as: "projectPermTeams",
                                          cond: {
                                            $in: [
                                              "$$projectPermTeams.level",
                                              [
                                                PermissionLevel.ADMIN,
                                                PermissionLevel.WRITE,
                                              ],
                                            ],
                                          },
                                        },
                                      },
                                      as: "projectPermTeams",
                                      in: "$$projectPermTeams.teamId",
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
                                          input: "$subProject.permissions",
                                          as: "projectPermTeams",
                                          cond: {
                                            $in: [
                                              "$$projectPermTeams.level",
                                              [
                                                PermissionLevel.ADMIN,
                                                PermissionLevel.WRITE,
                                              ],
                                            ],
                                          },
                                        },
                                      },
                                      as: "projectPermTeams",
                                      in: "$$projectPermTeams.teamId",
                                    },
                                  },
                                  [],
                                ],
                              },
                            ],
                          },
                        ]
                      : []),
                  ],
                }
              : { $literal: false },
            canComment: user?._id
              ? {
                  $or: [
                    {
                      $in: [
                        user._id,
                        {
                          $map: {
                            input: "$board.permissions",
                            as: "boardPermUsers",
                            in: "$$boardPermUsers.userId",
                          },
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
                                input: "$project.permissions",
                                as: "projectPermUsers",
                                in: "$$projectPermUsers.userId",
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
                                input: "$subProject.permissions",
                                as: "subProjectsPermUsers",
                                in: "$$subProjectsPermUsers.userId",
                              },
                            },
                            [],
                          ],
                        },
                      ],
                    },
                    ...(userTeamsIds?.length
                      ? [
                          {
                            $setIsSubset: [
                              userTeamsIds,
                              {
                                $ifNull: [
                                  {
                                    $map: {
                                      input: "$board.permissions",
                                      as: "boardPermTeams",
                                      in: "$$boardPermTeams.teamId",
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
                                      input: "$project.permissions",
                                      as: "projectPermTeams",
                                      in: "$$projectPermTeams.teamId",
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
                                      input: "$subProject.permissions",
                                      as: "projectPermTeams",
                                      in: "$$projectPermTeams.teamId",
                                    },
                                  },
                                  [],
                                ],
                              },
                            ],
                          },
                        ]
                      : []),
                  ],
                }
              : { $literal: false },
            title: 1,
            columnId: 1,
            description: 1,
            statusId: 1,
            projectId: 1,
            subProjectId: 1,
            assignees: 1,
            secondaryProjectsIds: 1,
          },
        },
      ])
    )[0];

    if (!task) {
      throw notFound;
    }

    return task;
  },
  {
    queryKeyMap: (args) => [args?._id],
  },
);

export default taskGetApi.handler;

export type TaskGetApi = typeof taskGetApi.Types;
