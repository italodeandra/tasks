import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import {
  apiHandlerWrapper,
  InferApiResponse,
  queryFnWrapper,
} from "@italodeandra/next/api/apiHandlerWrapper";
import { unauthorized } from "@italodeandra/next/api/errors";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { NextApiRequest, NextApiResponse } from "next";
import { connectDb } from "../../../db";
import getTimesheet, { TimesheetType } from "../../../collections/timesheet";
import dayjs from "dayjs";
import getTask from "../../../collections/task";
import { sumBy } from "lodash";

async function handler(_args: void, req: NextApiRequest, res: NextApiResponse) {
  await connectDb();
  let Timesheet = getTimesheet();
  let Task = getTask();
  let user = await getUserFromCookies(req, res);
  if (!user) {
    throw unauthorized;
  }

  let currentClock = await Timesheet.findOne({
    userId: user._id,
    startedAt: {
      $exists: true,
    },
    stoppedAt: {
      $exists: false,
    },
  });
  let task = await Task.findOne({
    _id: currentClock?.taskId,
  });

  return {
    currentClock:
      task && currentClock
        ? {
            _id: task._id,
            timesheet: {
              currentClockIn: currentClock.startedAt,
              time: sumBy(
                await Timesheet.find(
                  {
                    userId: user._id,
                    taskId: task._id,
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
          }
        : null,
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
                $gte: dayjs().startOf("day").toDate(),
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

export default apiHandlerWrapper(handler);

export type TimesheetStatusApiResponse = InferApiResponse<typeof handler>;

const queryKey = "/api/timesheet/status";

export const useTimesheetStatus = () =>
  useQuery([queryKey], queryFnWrapper<TimesheetStatusApiResponse>(queryKey));

export const invalidate_timesheetStatus = (queryClient: QueryClient) =>
  queryClient.invalidateQueries([queryKey]);
