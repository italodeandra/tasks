import createApi from "@italodeandra/next/api/createApi";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { connectDb } from "../../../db";
import getTimesheet from "../../../collections/timesheet";
import dayjs from "dayjs";
import { last, sumBy } from "lodash-es";

// change dayjs timezone to utc
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

export const timesheetGetMyOverviewApi = createApi(
  "/api/timesheet/get-my-overview",
  async (args: { today: string }, req, res) => {
    await connectDb();
    const user = await getUserFromCookies(req, res);
    const Timesheet = getTimesheet();
    if (!user) {
      throw unauthorized;
    }

    const currentTimesheet = await Timesheet.findOne(
      {
        userId: user._id,
        stoppedAt: {
          $exists: false,
        },
      },
      {
        projection: {
          startedAt: 1,
          taskId: 1,
          boardId: 1,
        },
      },
    );

    console.info("today", args.today);
    console.info("filter", {
      userId: user._id,
      startedAt: {
        $gte: dayjs(args.today).startOf("day").toDate(),
      },
      stoppedAt: {
        $lte: dayjs(args.today).endOf("day").toDate(),
      },
    });

    const todayTimesheets = await Timesheet.find(
      {
        userId: user._id,
        startedAt: {
          $gte: dayjs(args.today).startOf("day").toDate(),
        },
        stoppedAt: {
          $lte: dayjs(args.today).endOf("day").toDate(),
        },
      },
      {
        projection: {
          time: 1,
          boardId: 1,
        },
      },
    );

    console.info("todayTimesheets", todayTimesheets);

    return {
      todayTime: todayTimesheets.length
        ? {
            total: sumBy(todayTimesheets, "time"),
            lastBoardId: last(todayTimesheets)?.boardId,
          }
        : undefined,
      currentTimesheet,
    };
  },
);

export default timesheetGetMyOverviewApi.handler;
