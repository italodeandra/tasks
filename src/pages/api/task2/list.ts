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
    // const Project = getProject();
    // const Team = getTeam();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    // const teams = (
    //   await Team.find(
    //     {
    //       members: {
    //         $in: [user._id],
    //       },
    //     },
    //     {
    //       projection: {
    //         _id: 1,
    //       },
    //     },
    //   )
    // ).map((t) => t._id);
    //
    // const status = await TaskStatus.aggregate<
    //   Pick<ITaskStatus, "_id" | "title">
    // >([
    //   {
    //     $lookup: {
    //       from: Task.collection.collectionName,
    //       localField: "_id",
    //       foreignField: "statusId",
    //       as: "tasks",
    //       pipeline: [
    //         {
    //           $match: {
    //             $or: [
    //               {
    //                 createdByUserId: {
    //                   $in: [user._id],
    //                 },
    //                 projectId: {
    //                   $exists: false,
    //                 },
    //               },
    //               {
    //                 projectId: {
    //                   $exists: true,
    //                 },
    //               },
    //             ],
    //           },
    //         },
    //       ],
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: Project.collection.collectionName,
    //       localField: "_id",
    //       foreignField: "tasks.projectId",
    //       as: "projects",
    //       pipeline: [
    //         {
    //           $match: {
    //             "participants.usersIds": {
    //               $in: [user._id],
    //             },
    //           },
    //         },
    //       ],
    //     },
    //   },
    //   {
    //     $match: {
    //       archived: { $ne: true },
    //       $or: [
    //         {
    //           "projects.participants.usersIds": {
    //             $in: [user._id],
    //           },
    //         },
    //         {
    //           "projects.participants.teamsIds": {
    //             $in: teams,
    //           },
    //         },
    //         {
    //           "tasks.createdByUserId": {
    //             $in: [user._id],
    //           },
    //           "tasks.projectId": {
    //             $exists: false,
    //           },
    //         },
    //         {
    //           createdByUserId: user._id,
    //           "tasks.0": {
    //             $exists: false,
    //           },
    //         },
    //       ],
    //     },
    //   },
    //   {
    //     $sort: {
    //       order: 1,
    //     },
    //   },
    //   {
    //     $project: {
    //       title: 1,
    //     },
    //   },
    // ]);

    const status = await TaskStatus.find(
      {},
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
          archived: { $ne: true },
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
  },
);

export default taskListApi.handler;
