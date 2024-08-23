import createApi from "@italodeandra/next/api/createApi";
import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import getTaskStatus from "../../../collections/taskStatus";
import { maxBy } from "lodash-es";
import { taskListApi } from "./list";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";

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
      // tasksChanges: {
      //   _id: string;
      //   tasksOrderChange?: string[];
      //   tasks: {
      //     _id: string;
      //     type: "inserted" | "updated" | "deleted" | "moved-out" | "moved-in";
      //     title: string;
      //   }[];
      // }[];
    },
    req,
    res,
  ) => {
    await connectDb();
    const TaskStatus = getTaskStatus();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

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
      await TaskStatus.bulkWrite(
        sortedStatus.map((status, i) => ({
          updateOne: {
            filter: {
              _id: status._id,
              order: {
                $ne: sortedOrders[i],
              },
            },
            update: {
              $set: {
                // order: args.statusOrderChange!.indexOf(status._id.toString()),
                order: sortedOrders[i],
              },
            },
          },
        })),
      );
    }
    /*for (const tasksChange of args.tasksChanges) {
      if (tasksChange.tasksOrderChange) {
        const tasks = await Task.find({
          _id: {
            $in: tasksChange.tasksOrderChange.map(isomorphicObjectId)
          }
        })
        await Task.bulkWrite(
          tasks.map((task) => ({
            updateOne: {
              filter: {
                _id: task._id,
              },
              update: {
                $set: {
                  order: find(tasks, { _id: task._id })?.order,
                },
              },
            },
          }))
        )
      }
    }*/
    if (args.statusChanges) {
      for (const statusChange of args.statusChanges) {
        if (statusChange.type === "inserted" && statusChange.title) {
          const statuses = await TaskStatus.find({
            createdByUserId: user._id,
          });
          await TaskStatus.insertOne({
            _id: isomorphicObjectId(statusChange._id),
            title: statusChange.title,
            order: (maxBy(statuses, "order")?.order || 0) + 1,
            createdByUserId: user._id,
          });
        } else if (statusChange.type === "updated" && statusChange.title) {
          await TaskStatus.updateOne(
            {
              _id: isomorphicObjectId(statusChange._id),
              title: { $ne: statusChange.title },
            },
            {
              $set: {
                title: statusChange.title,
              },
            },
          );
        } else if (statusChange.type === "deleted") {
          await TaskStatus.deleteOne({
            _id: isomorphicObjectId(statusChange._id),
          });
        }
      }
    }
  },
  {
    mutationOptions: {
      onMutate(_variables, queryClient) {
        const previousData = taskListApi.getQueryData(queryClient);
        return {
          previousData,
        };
      },
    },
  },
);

export default taskBatchUpdateApi.handler;
