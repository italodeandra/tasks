import createApi from "@italodeandra/next/api/createApi";
import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import getTaskColumn from "../../../collections/taskColumn";
import { maxBy } from "lodash-es";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import getTask from "../../../collections/task";

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
        }[];
      }[];
    },
    req,
    res,
  ) => {
    await connectDb();
    const Task = getTask();
    const TaskColumn = getTaskColumn();
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
      const sortedColumn = args.columnOrderChange.map((id) =>
        columns.find((s) => s._id.equals(id)),
      ) as typeof columns;
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
          const sortedTasks = taskChangeColumn.tasksOrderChange.map((id) =>
            tasks.find((s) => s._id.equals(id)),
          ) as typeof tasks;
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
            if (taskChange.type === "inserted") {
              taskOperations.push({
                insertOne: {
                  document: {
                    columnId,
                    _id: isomorphicObjectId(taskChange._id),
                    title: taskChange.title || "",
                    order: nextOrder,
                  },
                },
              });
              nextOrder++;
            } else if (taskChange.type === "updated") {
              taskOperations.push({
                updateOne: {
                  filter: {
                    columnId,
                    _id: isomorphicObjectId(taskChange._id),
                    title: { $ne: taskChange.title },
                  },
                  update: {
                    $set: {
                      title: taskChange.title,
                    },
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
                    _id: isomorphicObjectId(taskChange._id),
                  },
                  update: {
                    $set: {
                      columnId,
                    },
                  },
                },
              });
            } else if (taskChange.type === "deleted") {
              taskOperations.push({
                updateOne: {
                  filter: {
                    columnId,
                    _id: isomorphicObjectId(taskChange._id),
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
      }
    }
    if (taskOperations.length) {
      await Task.bulkWrite(taskOperations);
    }
  },
);

export default taskBatchUpdateApi.handler;
