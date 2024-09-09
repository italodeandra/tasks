import createApi from "@italodeandra/next/api/createApi";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import getTask, { ITask } from "../../../collections/task";
import { connectDb } from "../../../db";
import getTaskColumn from "../../../collections/taskColumn";
import asyncMap from "@italodeandra/next/utils/asyncMap";
import getTeam from "../../../collections/team";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import getBoard from "../../../collections/board";
import querify from "@italodeandra/next/utils/querify";
import getUser, { IUser } from "@italodeandra/auth/collections/user/User";
import getProject, { IProject } from "../../../collections/project";
import getSubProject, { ISubProject } from "../../../collections/subProject";
import getTimesheet from "../../../collections/timesheet";
import { PermissionLevel } from "../../../collections/permission";
import getTaskStatus, { ITaskStatus } from "../../../collections/taskStatus";

export const taskListApi = createApi(
  "/api/task/list",
  async (
    args: {
      boardId: string;
      selectedProjects?: string[];
      selectedSubProjects?: string[];
    },
    req,
    res,
  ) => {
    await connectDb();
    const Task = getTask();
    const TaskColumn = getTaskColumn();
    const Team = getTeam();
    const Board = getBoard();
    const User = getUser();
    const Project = getProject();
    const SubProject = getSubProject();
    const Timesheet = getTimesheet();
    const TaskStatus = getTaskStatus();
    const user = await getUserFromCookies(req, res);

    const userTeams = user
      ? await Team.find(
          { "members.userId": { $in: [user._id] } },
          { projection: { _id: 1 } },
        )
      : undefined;
    const userTeamsIds = userTeams?.map((t) => t._id);
    const boardId = isomorphicObjectId(args.boardId);

    const columns = await TaskColumn.find(
      {
        boardId,
        archived: { $ne: true },
      },
      {
        sort: {
          order: 1,
        },
        projection: {
          title: 1,
          order: 1,
        },
      },
    );

    const queryArgs = querify(args);
    const isNoneSelected = queryArgs.selectedProjects
      ?.toString()
      ?.split(",")
      ?.some((p) => p === "__NONE__");
    const selectedProjects = queryArgs.selectedProjects
      ?.toString()
      ?.split(",")
      ?.filter((p) => p && p !== "__NONE__")
      ?.map(isomorphicObjectId);
    const selectedSubProjects = queryArgs.selectedSubProjects
      ?.toString()
      ?.split(",")
      ?.filter((p) => p && p !== "__NONE__")
      ?.map(isomorphicObjectId);

    return asyncMap(columns, async (c) => {
      const tasks = await Task.aggregate<
        Pick<ITask, "_id" | "title" | "order"> & {
          canEdit: boolean;
          canDelete: boolean;
          assignees: (Pick<
            IUser,
            "_id" | "name" | "email" | "profilePicture"
          > & {
            isMe: boolean;
            currentlyClocking: boolean;
          })[];
          project?: Pick<IProject, "_id" | "name">;
          subProject?: Pick<ISubProject, "_id" | "name">;
          status?: Pick<ITaskStatus, "_id" | "title">;
        }
      >([
        {
          $match: {
            columnId: c._id,
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
                  name: 1,
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
                  name: 1,
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
            from: TaskStatus.collection.collectionName,
            localField: "statusId",
            foreignField: "_id",
            as: "status",
            pipeline: [
              {
                $project: {
                  title: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$status",
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
              ...(isNoneSelected ||
              selectedProjects?.length ||
              selectedSubProjects?.length
                ? [
                    {
                      $or: [
                        ...(selectedProjects?.length ||
                        selectedSubProjects?.length
                          ? [
                              {
                                ...(selectedProjects?.length
                                  ? {
                                      projectId: {
                                        $in: selectedProjects,
                                      },
                                    }
                                  : {}),
                                ...(selectedSubProjects?.length
                                  ? {
                                      subProjectId: {
                                        $in: selectedSubProjects,
                                      },
                                    }
                                  : {}),
                              },
                            ]
                          : []),
                        ...(isNoneSelected
                          ? [
                              {
                                projectId: { $exists: false },
                              },
                            ]
                          : []),
                      ],
                    },
                  ]
                : []),
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
              ...(user
                ? [
                    {
                      $lookup: {
                        from: Timesheet.collection.collectionName,
                        localField: "_id",
                        foreignField: "userId",
                        pipeline: [
                          {
                            $match: {
                              stoppedAt: {
                                $exists: false,
                              },
                            },
                          },
                          {
                            $project: {
                              _id: 1,
                            },
                          },
                        ],
                        as: "timesheetMatches",
                      },
                    },
                    {
                      $addFields: {
                        currentlyClocking: {
                          $gt: [{ $size: "$timesheetMatches" }, 0],
                        },
                      },
                    },
                    {
                      $project: {
                        timesheetMatches: 0, // Remove the temporary array from the output
                      },
                    },
                  ]
                : []),
              {
                $sort: {
                  isMe: 1,
                },
              },
            ],
            as: "assignees",
          },
        },
        {
          $lookup: {
            from: Timesheet.collection.collectionName,
            localField: "_id",
            foreignField: "taskId",
            pipeline: [
              {
                $count: "total",
              },
            ],
            as: "timesheets",
          },
        },
        {
          $sort: {
            order: 1,
            updatedAt: 1,
          },
        },
        {
          $project: {
            title: 1,
            assignees: 1,
            canDelete: {
              $eq: [
                { $ifNull: [{ $arrayElemAt: ["$timesheets.total", 0] }, 0] },
                0,
              ],
            },
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
                                      $and: [
                                        {
                                          $ne: [
                                            {
                                              $type: "$$boardPermTeams.teamId",
                                            },
                                            "missing",
                                          ],
                                        },
                                        {
                                          $in: [
                                            "$$boardPermTeams.level",
                                            [
                                              PermissionLevel.ADMIN,
                                              PermissionLevel.WRITE,
                                            ],
                                          ],
                                        },
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
                                      $and: [
                                        {
                                          $ne: [
                                            {
                                              $type:
                                                "$$projectPermTeams.teamId",
                                            },
                                            "missing",
                                          ],
                                        },
                                        {
                                          $in: [
                                            "$$projectPermTeams.level",
                                            [
                                              PermissionLevel.ADMIN,
                                              PermissionLevel.WRITE,
                                            ],
                                          ],
                                        },
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
                                      $and: [
                                        {
                                          $ne: [
                                            {
                                              $type:
                                                "$$projectPermTeams.teamId",
                                            },
                                            "missing",
                                          ],
                                        },
                                        {
                                          $in: [
                                            "$$projectPermTeams.level",
                                            [
                                              PermissionLevel.ADMIN,
                                              PermissionLevel.WRITE,
                                            ],
                                          ],
                                        },
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
                  ],
                }
              : { $literal: false },
            "project._id": 1,
            "project.name": 1,
            "subProject._id": 1,
            "subProject.name": 1,
            "status._id": 1,
            "status.title": 1,
            order: 1,
          },
        },
      ]);

      return {
        ...c,
        tasks,
      } as typeof c & { tasks?: typeof tasks };
    });
  },
  {
    queryKeyMap: (args) => [
      args?.boardId,
      args?.selectedProjects,
      args?.selectedSubProjects,
    ],
  },
);

export default taskListApi.handler;
