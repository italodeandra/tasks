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
import getTimesheet, {
  ITimesheet,
  TimesheetType,
} from "../../../collections/timesheet";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { ITask } from "../../../collections/task";
import removeMd from "remove-markdown";
import dayjs from "dayjs";
import { invalidate_timesheetStatus } from "./status";

async function handler(
  args: { projectId: string; startDate: Date },
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDb();
  let Timesheet = getTimesheet();
  let user = await getUserFromCookies(req, res);
  if (!user) {
    throw unauthorized;
  }

  let projectId = isomorphicObjectId(args.projectId);

  let stats = await Timesheet.aggregate<{
    _id: "clock" | "payment";
    time: number;
  }>([
    {
      $match: {
        userId: user._id,
        projectId: projectId,
      },
    },
    {
      $group: {
        _id: {
          $cond: [
            {
              $in: [
                "$type",
                [TimesheetType.CLOCK_IN_OUT, TimesheetType.MANUAL],
              ],
            },
            "clock",
            "payment",
          ],
        },
        time: {
          $sum: "$time",
        },
      },
    },
  ]);

  return {
    timeClocked: stats.find((s) => s._id === "clock")?.time || 0,
    timePaid: stats.find((s) => s._id === "payment")?.time || 0,
    data: (
      await Timesheet.aggregate<
        Pick<
          ITimesheet,
          "_id" | "time" | "startedAt" | "type" | "createdAt"
        > & {
          task?: Pick<ITask, "_id" | "content">;
        }
      >([
        {
          $match: {
            userId: user._id,
            projectId: projectId,
            createdAt: {
              $gte: dayjs(args.startDate).startOf("month").toDate(),
              $lte: dayjs(args.startDate).endOf("month").toDate(),
            },
          },
        },
        {
          $lookup: {
            from: "tasks",
            localField: "taskId",
            foreignField: "_id",
            as: "task",
            pipeline: [
              {
                $project: {
                  content: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$task",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            time: 1,
            startedAt: 1,
            createdAt: 1,
            type: 1,
            task: 1,
          },
        },
        {
          $sort: {
            createdAt: 1,
          },
        },
      ])
    ).map((t) => ({
      ...t,
      task: t.task && {
        ...t.task,
        content: removeMd(t.task?.content).split("\n")[0],
      },
    })),
  };
}

export default apiHandlerWrapper(handler);

export type TimesheetListFromProjectApiArgs = InferApiArgs<typeof handler>;
export type TimesheetListFromProjectApiResponse = InferApiResponse<
  typeof handler
>;

const queryKey = "/api/timesheet/list-from-project";

export const useTimesheetListFromProject = (
  args: TimesheetListFromProjectApiArgs
) =>
  useQuery(
    [queryKey, args.projectId, args.startDate],
    queryFnWrapper<TimesheetListFromProjectApiResponse>(queryKey, args)
  );

export const invalidate_timesheetListFromProject = async (
  queryClient: QueryClient
) => {
  await invalidate_timesheetStatus(queryClient);
  return queryClient.invalidateQueries([queryKey]);
};
