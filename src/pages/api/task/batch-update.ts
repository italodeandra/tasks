import createApi from "@italodeandra/next/api/createApi";
import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import getTaskColumn from "../../../collections/taskColumn";
import { maxBy } from "lodash-es";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import getTask from "../../../collections/task";
import { taskListApi } from "./list";
import { boardState } from "../../../views/board/board.state";
import getTaskActivity, {
  ActivityType,
} from "../../../collections/taskActivity";
import getProject from "../../../collections/project";
import getTaskStatus from "../../../collections/taskStatus";

export const taskBatchUpdateApi = createApi(
  "/api/task/batch-update",
  async (
    args: {
      boardId: string;
      columnOrderChange?: string[];
      columnChanges?: {
        _id: string;
        type: "inserted" | "updated" | "deleted";
        title?: string;
      }[];
      tasksChanges?: {
        _id: string;
        tasksOrderChange?: string[];
        tasks?: {
          _id: string;
          type: "inserted" | "updated" | "deleted" | "moved-out" | "moved-in";
          title?: string;
          projectId?: string;
          statusId?: string;
        }[];
      }[];
    },
    req,
    res,
  ) => {
    await connectDb();
    const Task = getTask();
    const TaskColumn = getTaskColumn();
    const TaskActivity = getTaskActivity();
    const Project = getProject();
    const TaskStatus = getTaskStatus();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const boardId = isomorphicObjectId(args.boardId);

    // column
    const columnOperations: Parameters<typeof TaskColumn.bulkWrite>[0] = [];
    if (args.columnOrderChange) {
      const columns = await TaskColumn.find({
        _id: {
          $in: args.columnOrderChange.map(isomorphicObjectId),
        },
      });
      const sortedColumn = args.columnOrderChange
        .map((id) => columns.find((s) => s._id.equals(id)))
        .filter(Boolean) as typeof columns;
      const sortedOrders = sortedColumn.map((column) => column.order).sort();
      columnOperations.push(
        ...sortedColumn.map((column, i) => ({
          updateOne: {
            filter: {
              _id: column._id,
              order: {
                $ne: sortedOrders[i],
              },
            },
            update: {
              $set: {
                order: sortedOrders[i],
              },
            },
          },
        })),
      );
    }
    if (args.columnChanges) {
      const columns = await TaskColumn.find({});
      let nextOrder = (maxBy(columns, "order")?.order || 0) + 1;
      for (const columnChange of args.columnChanges) {
        if (columnChange.type === "inserted") {
          columnOperations.push({
            insertOne: {
              document: {
                _id: isomorphicObjectId(columnChange._id),
                title: columnChange.title || "",
                order: nextOrder,
                boardId,
              },
            },
          });
          nextOrder++;
        } else if (columnChange.type === "updated") {
          columnOperations.push({
            updateOne: {
              filter: {
                _id: isomorphicObjectId(columnChange._id),
                title: { $ne: columnChange.title },
              },
              update: {
                $set: {
                  title: columnChange.title,
                },
              },
            },
          });
        } else if (columnChange.type === "deleted") {
          columnOperations.push({
            updateOne: {
              filter: {
                _id: isomorphicObjectId(columnChange._id),
              },
              update: {
                $set: {
                  archived: true,
                },
              },
            },
          });
        }
      }
    }
    if (columnOperations.length) {
      await TaskColumn.bulkWrite(columnOperations);
    }

    // tasks
    const taskOperations: Parameters<typeof Task.bulkWrite>[0] = [];
    const activityOperations: Parameters<typeof TaskActivity.bulkWrite>[0] = [];
    if (args.tasksChanges) {
      for (const taskChangeColumn of args.tasksChanges) {
        const columnId = isomorphicObjectId(taskChangeColumn._id);
        if (taskChangeColumn.tasksOrderChange) {
          const tasks = await Task.find({
            columnId,
            _id: {
              $in: taskChangeColumn.tasksOrderChange.map(isomorphicObjectId),
            },
          });
          const sortedTasks = taskChangeColumn.tasksOrderChange
            .map((id) => tasks.find((s) => s._id.equals(id)))
            .filter(Boolean) as typeof tasks;
          const sortedOrders = sortedTasks.map((task) => task.order).sort();
          taskOperations.push(
            ...sortedTasks.map((task, i) => ({
              updateOne: {
                filter: {
                  columnId,
                  _id: task._id,
                  order: {
                    $ne: sortedOrders[i],
                  },
                },
                update: {
                  $set: {
                    order: sortedOrders[i],
                  },
                },
              },
            })),
          );
        }
        if (taskChangeColumn.tasks) {
          const columns = await Task.find({
            columnId,
          });
          let nextOrder = (maxBy(columns, "order")?.order || 0) + 1;
          for (const taskChange of taskChangeColumn.tasks) {
            const taskId = isomorphicObjectId(taskChange._id);
            if (taskChange.type === "inserted") {
              const projectId = taskChange.projectId
                ? isomorphicObjectId(taskChange.projectId)
                : undefined;
              const statusId = taskChange.statusId
                ? isomorphicObjectId(taskChange.statusId)
                : undefined;
              taskOperations.push({
                insertOne: {
                  document: {
                    columnId,
                    _id: taskId,
                    title: taskChange.title || "",
                    order: nextOrder,
                    projectId,
                    statusId,
                  },
                },
              });
              activityOperations.push({
                insertOne: {
                  document: {
                    taskId,
                    type: ActivityType.CREATE,
                    userId: user._id,
                    createdAt: new Date(),
                  },
                },
              });
              // if (projectId) {
              //   activityOperations.push({
              //     insertOne: {
              //       document: {
              //         taskId,
              //         type: ActivityType.MOVE,
              //         data: {
              //           type: "project",
              //           projectId,
              //         },
              //         userId: user._id,
              //         createdAt: dayjs().add(1, "second").toDate(),
              //       },
              //     },
              //   });
              // }
              nextOrder++;
            } else if (taskChange.type === "updated") {
              taskOperations.push({
                updateOne: {
                  filter: {
                    columnId,
                    _id: taskId,
                    title: { $ne: taskChange.title },
                  },
                  update: {
                    $set: {
                      title: taskChange.title,
                    },
                  },
                },
              });
              activityOperations.push({
                insertOne: {
                  document: {
                    type: ActivityType.CHANGE_TITLE,
                    taskId,
                    data: {
                      title: taskChange.title,
                    },
                    userId: user._id,
                  },
                },
              });
            } else if (taskChange.type === "moved-in") {
              const movedOutColumn = args.tasksChanges.find((s) =>
                s.tasks?.find(
                  (t) => t.type === "moved-out" && t._id === taskChange._id,
                ),
              );
              taskOperations.push({
                updateOne: {
                  filter: {
                    columnId: isomorphicObjectId(movedOutColumn?._id),
                    _id: taskId,
                  },
                  update: {
                    $set: {
                      columnId,
                    },
                  },
                },
              });
              activityOperations.push({
                insertOne: {
                  document: {
                    type: ActivityType.MOVE,
                    taskId,
                    data: {
                      type: "column",
                      columnId,
                    },
                    userId: user._id,
                  },
                },
              });
            } else if (taskChange.type === "deleted") {
              taskOperations.push({
                updateOne: {
                  filter: {
                    columnId,
                    _id: taskId,
                  },
                  update: {
                    $set: {
                      archived: true,
                    },
                  },
                },
              });
              activityOperations.push({
                insertOne: {
                  document: {
                    type: ActivityType.DELETE,
                    taskId,
                    userId: user._id,
                  },
                },
              });
            }
          }
        }
      }
    }
    if (taskOperations.length) {
      for (const operation of taskOperations) {
        // @ts-expect-error trust me
        if (operation.insertOne?.document.columnId) {
          const column = await TaskColumn.findById(
            // @ts-expect-error trust me
            isomorphicObjectId(operation.insertOne.document.columnId),
            {
              projection: {
                linkedStatusId: 1,
              },
            },
          );
          if (column?.linkedStatusId) {
            // @ts-expect-error trust me
            operation.insertOne.document.statusId = column.linkedStatusId;
            // activityOperations.push({
            //   insertOne: {
            //     document: {
            //       // @ts-expect-error trust me
            //       taskId: operation.insertOne.document._id,
            //       type: ActivityType.MOVE,
            //       data: {
            //         type: "status",
            //         statusId: column.linkedStatusId,
            //       },
            //       userId: user._id,
            //       createdAt: dayjs().add(2, "second").toDate(),
            //     },
            //   },
            // });
          }
        }
      }
      await Task.bulkWrite(taskOperations);
    }
    if (activityOperations.length) {
      void (async () => {
        for (const operation of activityOperations) {
          // @ts-expect-error trust me
          if (operation.insertOne?.document.type === ActivityType.MOVE) {
            // @ts-expect-error trust me
            if (operation.insertOne.document.data.columnId) {
              // @ts-expect-error trust me
              operation.insertOne.document.data.title =
                (await TaskColumn.findById(
                  // @ts-expect-error trust me
                  operation.insertOne.document.data.columnId,
                  { projection: { title: 1 } },
                ))!.title;
            }
            // @ts-expect-error trust me
            if (operation.insertOne.document.data.projectId) {
              // @ts-expect-error trust me
              operation.insertOne.document.data.title = (await Project.findById(
                // @ts-expect-error trust me
                operation.insertOne.document.data.projectId,
                { projection: { name: 1 } },
              ))!.name;
            }
            // @ts-expect-error trust me
            if (operation.insertOne.document.data.statusId) {
              // @ts-expect-error trust me
              operation.insertOne.document.data.title =
                (await TaskStatus.findById(
                  // @ts-expect-error trust me
                  operation.insertOne.document.data.statusId,
                  { projection: { title: 1 } },
                ))!.title;
            }
          }
        }
        await TaskActivity.bulkWrite(activityOperations);
      })();
    }
  },
  {
    mutationOptions: {
      async onSuccess(_d, variables, _c, queryClient) {
        void taskListApi.invalidateQueries(queryClient, {
          boardId: variables.boardId,
          selectedProjects: boardState.selectedProjects,
          selectedSubProjects: boardState.selectedSubProjects,
        });
      },
    },
  },
);

export default taskBatchUpdateApi.handler;
