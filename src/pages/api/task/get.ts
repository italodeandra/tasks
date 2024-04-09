import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import { connectDb } from "../../../db";
import getTask, { ITask } from "../../../collections/task";
import getProject, { IProject } from "../../../collections/project";
import createApi from "@italodeandra/next/api/createApi";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";

export const taskGetApi = createApi(
  "/api/task/get",
  async (args: { _id: string }, req: NextApiRequest, res: NextApiResponse) => {
    await connectDb();
    let Task = getTask();
    let Project = getProject();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    return (
      await Task.aggregate<
        Pick<
          ITask,
          "_id" | "description" | "status" | "title" | "createdAt" | "updatedAt"
        > & {
          project?: Pick<IProject, "_id" | "name">;
          timesheet?: {
            totalTime?: number;
            currentClockIn?: Date;
          };
        }
      >([
        {
          $match: {
            _id: isomorphicObjectId(args._id),
            userId: user._id,
          },
        },
        {
          $lookup: {
            from: "timesheet",
            let: { taskId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$taskId", "$$taskId"],
                  },
                  userId: user._id,
                },
              },
              {
                $sort: {
                  startedAt: -1,
                },
              },
              {
                $group: {
                  _id: null,
                  totalTime: {
                    $sum: "$time",
                  },
                  currentClockIn: {
                    $first: {
                      $cond: [
                        {
                          $and: [
                            { $ne: [{ $type: "$startedAt" }, "missing"] },
                            { $eq: [{ $type: "$stoppedAt" }, "missing"] },
                          ],
                        },
                        "$startedAt",
                        null,
                      ],
                    },
                  },
                },
              },
            ],
            as: "timesheet",
          },
        },
        {
          $unwind: {
            path: "$timesheet",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: Project.collection.collectionName,
            localField: "projectId",
            foreignField: "_id",
            as: "project",
            pipeline: [{ $project: { name: 1 } }],
          },
        },
        {
          $unwind: {
            path: "$project",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            status: 1,
            project: 1,
            title: 1,
            description: 1,
            "timesheet.totalTime": 1,
            "timesheet.currentClockIn": 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ])
    )[0];
  },
  {
    queryKeyMap: (args) => [args?._id].filter(Boolean),
  }
);

export default taskGetApi.handler;

export type TaskGetApi = typeof taskGetApi.Types;
