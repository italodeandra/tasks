import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import { connectDb } from "../../../db";
import getTask, { ITask, TaskStatus } from "../../../collections/task";
import dayjs from "dayjs";
import getProject, { IProject } from "../../../collections/project";
import createApi from "@italodeandra/next/api/createApi";
import getComment from "../../../collections/comment";
import getClient, { IClient } from "../../../collections/client";
import getTimesheet from "../../../collections/timesheet";
import { columns } from "../../../consts";

export const taskListApi = createApi(
  "/api/task/list",
  async (_args: void, req: NextApiRequest, res: NextApiResponse) => {
    await connectDb();
    const Task = getTask();
    const Project = getProject();
    const Comment = getComment();
    const Timesheet = getTimesheet();
    const Client = getClient();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    return Task.aggregate<
      Pick<ITask, "_id" | "status" | "order" | "title" | "createdAt"> & {
        client?: Pick<IClient, "_id" | "name">;
        project?: Pick<IProject, "_id" | "name">;
        timesheet?: {
          totalTime?: number;
          currentClockIn?: Date;
        };
        comments?: number;
        description?: boolean;
      }
    >([
      {
        $match: {
          userId: user._id,
          $or: [
            {
              status: {
                $ne: TaskStatus.DONE,
              },
            },
            {
              status: TaskStatus.DONE,
              updatedAt: {
                $gte: dayjs().subtract(1, "month").toDate(),
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: Timesheet.collection.collectionName,
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
          pipeline: [{ $project: { name: 1, clientId: 1 } }],
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
          from: Client.collection.collectionName,
          localField: "project.clientId",
          foreignField: "_id",
          as: "client",
          pipeline: [{ $project: { name: 1 } }],
        },
      },
      {
        $unwind: {
          path: "$client",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: Comment.collection.collectionName,
          localField: "_id",
          foreignField: "taskId",
          pipeline: [
            {
              $count: "count",
            },
          ],
          as: "comments",
        },
      },
      {
        $addFields: {
          comments: {
            $arrayElemAt: ["$comments.count", 0],
          },
          description: {
            $cond: [
              {
                $ne: [{ $type: "$description" }, "missing"],
              },
              true,
              false,
            ],
          },
        },
      },
      {
        $addFields: {
          statusOrder: {
            $switch: {
              branches: columns.map((status, index) => ({
                case: { $eq: ["$status", status] },
                then: index,
              })),
              default: 4,
            },
          },
        },
      },
      {
        $sort: {
          statusOrder: 1,
          order: 1,
        },
      },
      {
        $project: {
          description: 1,
          status: 1,
          "project._id": 1,
          "project.name": 1,
          client: 1,
          order: 1,
          title: 1,
          "timesheet.totalTime": 1,
          "timesheet.currentClockIn": 1,
          createdAt: 1,
          comments: 1,
        },
      },
    ]);
  }
);

export default taskListApi.handler;

export type TaskListApi = typeof taskListApi.Types;
