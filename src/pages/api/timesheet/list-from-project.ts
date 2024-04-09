import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
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
import createApi from "@italodeandra/next/api/createApi";

export const timesheetListFromProjectApi = createApi(
  "/api/timesheet/list-from-project",
  async function (
    args: { projectId: string; startDate: Date },
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    await connectDb();
    const Timesheet = getTimesheet();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const projectId = isomorphicObjectId(args.projectId);

    const stats = await Timesheet.aggregate<{
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
            "_id" | "time" | "startedAt" | "type" | "createdAt" | "description"
          > & {
            task?: Pick<ITask, "_id" | "title">;
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
                    title: 1,
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
              description: 1,
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
          content: removeMd(t.task.title).split("\n")[0],
        },
      })),
    };
  },
  {
    queryKeyMap: (args) => [args?.projectId, args?.startDate].filter(Boolean),
  }
);

export default timesheetListFromProjectApi.handler;

export type TimesheetListFromProjectApi =
  typeof timesheetListFromProjectApi.Types;
