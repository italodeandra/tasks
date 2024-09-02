import createApi from "@italodeandra/next/api/createApi";
import { unauthorized } from "@italodeandra/next/api/errors";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import getTask, { ITask } from "../../../collections/task";
import { connectDb } from "../../../db";
import getTaskColumn from "../../../collections/taskColumn";
import asyncMap from "@italodeandra/next/utils/asyncMap";
import getTeam from "../../../collections/team";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import getBoard from "../../../collections/board";
import querify from "@italodeandra/next/utils/querify";
import getUser from "@italodeandra/auth/collections/user/User";
import getProject from "../../../collections/project";
import getSubProject from "../../../collections/subProject";

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
    const user = await getUserFromCookies(req, res);

    const userTeams = user
      ? await Team.find(
          { "members.userId": { $in: [user._id] } },
          { projection: { _id: 1 } },
        )
      : undefined;
    const userTeamsIds = userTeams?.map((t) => t._id);
    const boardId = isomorphicObjectId(args.boardId);

    const haveAccessToBoard = await Board.countDocuments({
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

    if (!haveAccessToBoard) {
      throw unauthorized;
    }

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
      const tasks = await asyncMap(
        await Task.aggregate<Pick<ITask, "_id" | "title" | "assignees">>([
          {
            $lookup: {
              from: Project.collection.collectionName,
              localField: "projectId",
              foreignField: "_id",
              as: "project",
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
            },
          },
          {
            $unwind: {
              path: "$subProject",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: {
              archived: { $ne: true },
              "project.archived": { $ne: true },
              "subProject.archived": { $ne: true },
              columnId: c._id,
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
            $project: {
              title: 1,
              assignees: 1,
            },
          },
        ]),
        async ({ assignees, ...task }) => {
          return {
            ...task,
            assignees: await asyncMap(
              await User.find(
                {
                  _id: {
                    $in: assignees,
                  },
                },
                {
                  projection: {
                    name: 1,
                    email: 1,
                  },
                },
              ),
              async (user2) => ({
                ...user2,
                isMe: !!user && user2._id.equals(user._id),
              }),
            ),
          };
        },
      );

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
