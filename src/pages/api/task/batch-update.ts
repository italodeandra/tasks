import createApi from "@italodeandra/next/api/createApi";
import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import getTaskColumn from "../../../collections/taskColumn";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import getTask from "../../../collections/task";
import { taskListApi } from "./list";
import { boardState } from "../../../views/board/board.state";
import getTaskActivity, {
  ActivityType,
} from "../../../collections/taskActivity";
import { Instruction } from "../../../views/board/kanban/generateInstructions";
import { generateMongoBulkWrites } from "../../../views/board/kanban/generateMongoWrites";
import { flatten, merge } from "lodash-es";
import filterBoolean from "@italodeandra/ui/utils/filterBoolean";
import asyncMap from "@italodeandra/next/utils/asyncMap";
import getTaskStatus from "../../../collections/taskStatus";
import dayjs from "dayjs";
import getTimesheet from "../../../collections/timesheet";

export const taskBatchUpdateApi = createApi(
  "/api/task/batch-update",
  async (
    args: {
      boardId: string;
      selectedProjects?: string[];
      selectedSubProjects?: string[];
      instructions: Instruction[];
    },
    req,
    res,
  ) => {
    await connectDb();
    const Task = getTask();
    const TaskColumn = getTaskColumn();
    const TaskActivity = getTaskActivity();
    const TaskStatus = getTaskStatus();
    const Timesheet = getTimesheet();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const boardId = isomorphicObjectId(args.boardId);

    const operations = generateMongoBulkWrites(args.instructions);
    if (operations.columnOps.length) {
      const columnOps = filterBoolean(
        operations.columnOps.map((op) => {
          if (op.insertOne?.document) {
            return merge(op, {
              insertOne: {
                document: {
                  ...op.insertOne.document,
                  _id: isomorphicObjectId(op.insertOne.document._id),
                  boardId,
                },
              },
            });
          }
          if (op.updateOne) {
            return merge(op, {
              updateOne: {
                filter: {
                  _id: isomorphicObjectId(op.updateOne.filter._id),
                },
              },
            });
          }
        }),
      );
      if (columnOps.length) {
        await TaskColumn.bulkWrite(columnOps);
      }
    }
    if (operations.taskOps.length) {
      const taskOps = filterBoolean(
        await asyncMap(operations.taskOps, async (op) => {
          if (op.insertOne?.document) {
            const column = await TaskColumn.findById(
              isomorphicObjectId(op.insertOne.document.columnId),
              {
                projection: {
                  linkedStatusId: 1,
                },
              },
            );
            if (column?.linkedStatusId) {
              op.insertOne.document.statusId = column.linkedStatusId;
            }
            return merge(op, {
              insertOne: {
                document: {
                  _id: isomorphicObjectId(op.insertOne.document._id),
                  columnId: isomorphicObjectId(op.insertOne.document.columnId),
                },
              },
            });
          }
          if (op.updateOne?.update.$set.columnId) {
            const column = await TaskColumn.findById(
              isomorphicObjectId(op.updateOne.update.$set.columnId),
              {
                projection: {
                  linkedStatusId: 1,
                },
              },
            );
            if (column?.linkedStatusId) {
              op.updateOne.update.$set.statusId = column.linkedStatusId;
            }
            return merge(op, {
              updateOne: {
                filter: {
                  _id: isomorphicObjectId(op.updateOne.filter._id),
                },
                update: {
                  $set: {
                    columnId: isomorphicObjectId(
                      op.updateOne.update.$set.columnId,
                    ),
                  },
                },
              },
            });
          }
          if (op.updateOne) {
            return merge(op, {
              updateOne: {
                filter: {
                  _id: isomorphicObjectId(op.updateOne.filter._id),
                },
              },
            });
          }
          if (op.deleteOne) {
            if (
              await Timesheet.countDocuments({
                taskId: isomorphicObjectId(op.deleteOne.filter._id),
              })
            ) {
              return {
                updateOne: {
                  filter: {
                    _id: isomorphicObjectId(op.deleteOne.filter._id),
                  },
                  update: {
                    $set: {
                      archived: true,
                    },
                  },
                },
              };
            }
            return merge(op, {
              deleteOne: {
                filter: {
                  _id: isomorphicObjectId(op.deleteOne.filter._id),
                },
              },
            });
          }
        }),
      );
      if (taskOps.length) {
        await Task.bulkWrite(taskOps);
        const activityOps: Parameters<typeof TaskActivity.bulkWrite>[0] = [];
        for (const op of operations.taskOps) {
          if (op.insertOne?.document) {
            activityOps.push({
              insertOne: {
                document: {
                  taskId: isomorphicObjectId(op.insertOne.document._id),
                  type: ActivityType.CREATE,
                  userId: user._id,
                  createdAt: new Date(),
                },
              },
            });
          }
          if (op.updateOne?.update.$set.title) {
            activityOps.push({
              insertOne: {
                document: {
                  type: ActivityType.CHANGE_TITLE,
                  taskId: isomorphicObjectId(op.updateOne.filter._id),
                  data: {
                    title: op.updateOne.update.$set.title,
                  },
                  userId: user._id,
                },
              },
            });
          }
          if (op.updateOne?.update.$set.columnId) {
            activityOps.push({
              insertOne: {
                document: {
                  type: ActivityType.MOVE,
                  taskId: isomorphicObjectId(op.updateOne.filter._id),
                  data: {
                    type: "column",
                    title: await TaskColumn.findById(
                      isomorphicObjectId(op.updateOne.update.$set.columnId),
                    ).then((column) => column?.title),
                  },
                  userId: user._id,
                  createdAt: dayjs().toDate(),
                },
              },
            });
            if (op.updateOne.update.$set.statusId) {
              activityOps.push({
                insertOne: {
                  document: {
                    type: ActivityType.SET,
                    taskId: isomorphicObjectId(op.updateOne.filter._id),
                    data: {
                      type: "status",
                      title: await TaskStatus.findById(
                        isomorphicObjectId(op.updateOne.update.$set.statusId),
                      ).then((column) => column?.title),
                    },
                    userId: user._id,
                    createdAt: dayjs().add(1, "second").toDate(),
                  },
                },
              });
            }
          }
          if (op.updateOne?.update.$set.archived || op.deleteOne?.filter._id) {
            activityOps.push({
              insertOne: {
                document: {
                  type: ActivityType.DELETE,
                  taskId: isomorphicObjectId(
                    op.updateOne?.filter._id || op.deleteOne?.filter._id,
                  ),
                  userId: user._id,
                },
              },
            });
          }
        }
        if (activityOps.length) {
          await TaskActivity.bulkWrite(flatten(activityOps));
        }
      }
    }
  },
  {
    mutationOptions: {
      onSuccess(_d, variables, _c, queryClient) {
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
