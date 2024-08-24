import createApi from "@italodeandra/next/api/createApi";
import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import getTaskStatus from "../../../collections/taskStatus";
import { maxBy } from "lodash-es";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import getTask from "../../../collections/task2";

export const taskBatchUpdateApi = createApi(
  "/api/task2/batch-update",
  async (
    args: {
      statusOrderChange?: string[];
      statusChanges?: {
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
    const TaskStatus = getTaskStatus();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    // status
    const statusOperations: Parameters<typeof TaskStatus.bulkWrite>[0] = [];
    if (args.statusOrderChange) {
      const statuses = await TaskStatus.find({
        _id: {
          $in: args.statusOrderChange.map(isomorphicObjectId),
        },
      });
      const sortedStatus = args.statusOrderChange.map((id) =>
        statuses.find((s) => s._id.equals(id)),
      ) as typeof statuses;
      const sortedOrders = sortedStatus.map((status) => status.order).sort();
      statusOperations.push(
        ...sortedStatus.map((status, i) => ({
          updateOne: {
            filter: {
              _id: status._id,
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
    if (args.statusChanges) {
      const statuses = await TaskStatus.find({});
      let nextOrder = (maxBy(statuses, "order")?.order || 0) + 1;
      for (const statusChange of args.statusChanges) {
        if (statusChange.type === "inserted") {
          statusOperations.push({
            insertOne: {
              document: {
                _id: isomorphicObjectId(statusChange._id),
                title: statusChange.title || "",
                order: nextOrder,
                createdByUserId: user._id,
              },
            },
          });
          nextOrder++;
        } else if (statusChange.type === "updated") {
          statusOperations.push({
            updateOne: {
              filter: {
                _id: isomorphicObjectId(statusChange._id),
                title: { $ne: statusChange.title },
              },
              update: {
                $set: {
                  title: statusChange.title,
                },
              },
            },
          });
        } else if (statusChange.type === "deleted") {
          statusOperations.push({
            deleteOne: {
              filter: {
                _id: isomorphicObjectId(statusChange._id),
              },
            },
          });
        }
      }
    }
    if (statusOperations.length) {
      await TaskStatus.bulkWrite(statusOperations);
    }

    // tasks
    const taskOperations: Parameters<typeof Task.bulkWrite>[0] = [];
    if (args.tasksChanges) {
      for (const taskChangeStatus of args.tasksChanges) {
        const statusId = isomorphicObjectId(taskChangeStatus._id);
        if (taskChangeStatus.tasksOrderChange) {
          const tasks = await Task.find({
            statusId,
            _id: {
              $in: taskChangeStatus.tasksOrderChange.map(isomorphicObjectId),
            },
          });
          const sortedTasks = taskChangeStatus.tasksOrderChange.map((id) =>
            tasks.find((s) => s._id.equals(id)),
          ) as typeof tasks;
          const sortedOrders = sortedTasks.map((task) => task.order).sort();
          taskOperations.push(
            ...sortedTasks.map((task, i) => ({
              updateOne: {
                filter: {
                  statusId,
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
        if (taskChangeStatus.tasks) {
          const statuses = await Task.find({
            statusId,
          });
          let nextOrder = (maxBy(statuses, "order")?.order || 0) + 1;
          for (const taskChange of taskChangeStatus.tasks) {
            if (taskChange.type === "inserted") {
              taskOperations.push({
                insertOne: {
                  document: {
                    statusId,
                    _id: isomorphicObjectId(taskChange._id),
                    title: taskChange.title || "",
                    order: nextOrder,
                    createdByUserId: user._id,
                  },
                },
              });
              nextOrder++;
            } else if (taskChange.type === "updated") {
              taskOperations.push({
                updateOne: {
                  filter: {
                    statusId,
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
              const movedOutStatus = args.tasksChanges.find((s) =>
                s.tasks?.find(
                  (t) => t.type === "moved-out" && t._id === taskChange._id,
                ),
              );
              taskOperations.push({
                updateOne: {
                  filter: {
                    statusId: isomorphicObjectId(movedOutStatus?._id),
                    _id: isomorphicObjectId(taskChange._id),
                  },
                  update: {
                    $set: {
                      statusId,
                    },
                  },
                },
              });
            } else if (taskChange.type === "deleted") {
              taskOperations.push({
                deleteOne: {
                  filter: {
                    statusId,
                    _id: isomorphicObjectId(taskChange._id),
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
