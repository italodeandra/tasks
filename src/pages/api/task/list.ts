import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import { connectDb } from "../../../db";
import getTask, { ITask, TaskStatus } from "../../../collections/task";
import showdown from "showdown";
import dayjs from "dayjs";
import getProject, { IProject } from "../../../collections/project";
import createApi from "@italodeandra/next/api/createApi";

let converter = new showdown.Converter({
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
  openLinksInNewWindow: true,
});

let api = createApi(
  "/api/task/list",
  async (_args: void, req: NextApiRequest, res: NextApiResponse) => {
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
          "_id" | "content" | "status" | "order" | "title" | "createdAt"
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
                  $gte: dayjs().subtract(1, "week").toDate(),
                },
              },
            ],
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
                  startedAt: -1, // Sorting in descending order
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
          $addFields: {
            statusOrder: {
              $switch: {
                branches: [
                  TaskStatus.DOING,
                  TaskStatus.BLOCKED,
                  TaskStatus.TODO,
                  TaskStatus.DONE,
                ].map((status, index) => ({
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
            content: 1,
            status: 1,
            project: 1,
            order: 1,
            title: 1,
            "timesheet.totalTime": 1,
            "timesheet.currentClockIn": 1,
            createdAt: 1,
          },
        },
      ])
    ).map((t) => ({
      ...t,
      titleHtml: converter.makeHtml(
        (t.title || t.content || "")
          .split("---")[0]
          .replaceAll("[ ]", "-")
          .replaceAll("[x]", "-")
      ),
      title: t.title || t.content,
    }));
  }
);

export default api.handler;

export type TaskListApi = typeof api.Types;

export const taskListApi = api;
