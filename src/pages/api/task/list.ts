import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import {
  apiHandlerWrapper,
  InferApiArgs,
  InferApiResponse,
  queryFnWrapper,
} from "@italodeandra/next/api/apiHandlerWrapper";
import { unauthorized } from "@italodeandra/next/api/errors";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { NextApiRequest, NextApiResponse } from "next";
import { connectDb } from "../../../db";
import getTask, { ITask, TaskStatus } from "../../../collections/task";
import showdown from "showdown";
import dayjs from "dayjs";
import { invalidate_timesheetListFromProject } from "../timesheet/list-from-project";
import { invalidate_timesheetStatus } from "../timesheet/status";

let converter = new showdown.Converter({
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
  openLinksInNewWindow: true,
});

async function handler(_args: void, req: NextApiRequest, res: NextApiResponse) {
  await connectDb();
  let Task = getTask();
  const user = await getUserFromCookies(req, res);
  if (!user) {
    throw unauthorized;
  }

  return (
    await Task.aggregate<
      Pick<
        ITask,
        "_id" | "content" | "status" | "projectId" | "order" | "title"
      > & {
        timesheet?: {
          totalTime: number;
          currentClockIn: Date | null;
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
        $project: {
          content: 1,
          status: 1,
          projectId: 1,
          order: 1,
          title: 1,
          "timesheet.totalTime": 1,
          "timesheet.currentClockIn": 1,
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
  }));

  /*return asyncMap(
    await Task.find(
      {
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
      {
        projection: {
          content: 1,
          status: 1,
          projectId: 1,
          order: 1,
          title: 1,
        },
        sort: {
          status: 1,
          order: 1,
        },
      }
    ),
    async ({ title, content, ...t }) => ({
      ...t,
      timesheet: {
        currentClockIn: (
          await Timesheet.findOne(
            {
              userId: user._id,
              taskId: t._id,
              startedAt: {
                $exists: true,
              },
              stoppedAt: {
                $exists: false,
              },
            },
            {
              projection: {
                startedAt: 1,
              },
            }
          )
        )?.startedAt,
        time: sumBy(
          await Timesheet.find(
            {
              userId: user._id,
              taskId: t._id,
              time: {
                $exists: true,
              },
            },
            {
              projection: {
                time: 1,
              },
            }
          ),
          "time"
        ),
      },
      titleHtml: converter.makeHtml(
        (title || content || "")
          .split("---")[0]
          .replaceAll("[ ]", "-")
          .replaceAll("[x]", "-")
      ),
    })
  );*/
}

export default apiHandlerWrapper(handler);

export type TaskListApiArgs = InferApiArgs<typeof handler>;
export type TaskListApiResponse = InferApiResponse<typeof handler>;

const queryKey = "/api/task/list";

export const useTaskList = (args?: TaskListApiArgs) =>
  useQuery([queryKey], queryFnWrapper<TaskListApiResponse>(queryKey, args));

export const invalidate_taskList = async (queryClient: QueryClient) => {
  await invalidate_timesheetListFromProject(queryClient);
  await invalidate_timesheetStatus(queryClient);
  return queryClient.invalidateQueries([queryKey]);
};
