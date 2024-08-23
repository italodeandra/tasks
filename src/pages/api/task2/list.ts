import createApi from "@italodeandra/next/api/createApi";
import { unauthorized } from "@italodeandra/next/api/errors";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import getTask from "../../../collections/task2";
import { connectDb } from "../../../db";
import getTaskStatus from "../../../collections/taskStatus";
import asyncMap from "@italodeandra/next/utils/asyncMap";

export const taskListApi = createApi(
  "/api/task2/list",
  async (_args: void, req, res) => {
    await connectDb();
    const Task = getTask();
    const TaskStatus = getTaskStatus();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const status = await TaskStatus.find(
      {
        createdByUserId: user._id,
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

    return asyncMap(status, async (s) => {
      const tasks = await Task.find(
        {
          statusId: s._id,
        },
        {
          projection: {
            title: 1,
          },
        },
      );

      return {
        ...s,
        tasks,
      } as typeof s & { tasks?: typeof tasks };
    });

    // const tasks = await Task.aggregate<
    //   Pick<ITask, "_id" | "title"> & {
    //     status: Pick<ITaskStatus, "_id" | "title">;
    //     // project?: Pick<IProject, "_id" | "name">;
    //   }
    // >([
    //   {
    //     $match: {
    //       createdByUserId: user._id,
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: TaskStatus.collection.collectionName,
    //       localField: "statusId",
    //       foreignField: "_id",
    //       as: "status",
    //     },
    //   },
    //   {
    //     $unwind: "$status",
    //   },
    //   {
    //     $lookup: {
    //       from: Project.collection.collectionName,
    //       localField: "projectId",
    //       foreignField: "_id",
    //       as: "project",
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: "$project",
    //       preserveNullAndEmptyArrays: true,
    //     },
    //   },
    //   {
    //     $match: {
    //       "project.participants": {
    //         $in: [user._id],
    //       },
    //     },
    //   },
    //   {
    //     $project: {
    //       title: 1,
    //       "status.title": 1,
    //       // "project.name": 1,
    //     },
    //   },
    // ]);
    //
    // return toPairs(groupBy(tasks, "status._id")).map(([statusId, tasks]) => {
    //   const mappedTasks = tasks.map((t) => omit(t, "status"));
    //   return {
    //     _id: statusId,
    //     title: tasks[0].status.title,
    //     tasks: mappedTasks,
    //   } as {
    //     _id: string;
    //     title: string;
    //     tasks?: typeof mappedTasks;
    //   };
    // });
  },
);

export default taskListApi.handler;
