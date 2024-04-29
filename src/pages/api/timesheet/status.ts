import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import { connectDb } from "../../../db";
import getTimesheet, { TimesheetType } from "../../../collections/timesheet";
import getTask, { ITask } from "../../../collections/task";
import createApi from "@italodeandra/next/api/createApi";

export const timesheetStatusApi = createApi(
  "/api/timesheet/status",
  async (
    args: {
      today: string;
    },
    req: NextApiRequest,
    res: NextApiResponse
  ) => {
    await connectDb();
    const Timesheet = getTimesheet();
    const Task = getTask();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const today = new Date(args.today);

    return {
      currentClock: (
        await Timesheet.aggregate<{
          _id: ITask["_id"];
          timesheet: {
            currentClockIn: Date;
          };
        }>([
          {
            $match: {
              userId: user._id,
              startedAt: {
                $exists: true,
              },
              stoppedAt: {
                $exists: false,
              },
            },
          },
          {
            $lookup: {
              from: Task.collection.collectionName,
              localField: "taskId",
              foreignField: "_id",
              as: "task",
            },
          },
          {
            $unwind: "$task",
          },
          {
            $project: {
              _id: "$task._id",
              timesheet: {
                currentClockIn: "$startedAt",
              },
            },
          },
        ])
      )[0],
      todayClockedTime:
        (
          await Timesheet.aggregate<{
            _id: "clock" | "payment";
            time: number;
          }>([
            {
              $match: {
                userId: user._id,
                type: {
                  $in: [TimesheetType.CLOCK_IN_OUT, TimesheetType.MANUAL],
                },
                createdAt: {
                  $gte: today,
                },
              },
            },
            {
              $group: {
                _id: null,
                time: {
                  $sum: "$time",
                },
              },
            },
          ])
        )[0]?.time || 0,
    };
  }
);

export default timesheetStatusApi.handler;
