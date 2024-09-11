import createApi from "@italodeandra/next/api/createApi";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { connectDb } from "../../../db";
import getTimesheet from "../../../collections/timesheet";
import dayjs from "dayjs";
import { last, sumBy } from "lodash-es";

export const timesheetGetMyOverviewApi = createApi(
  "/api/timesheet/get-my-overview",
  async (args: { startOfToday: string; endOfToday: string }, req, res) => {
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

    console.info("args", args);
    console.info("filter", {
      userId: user._id,
      startedAt: {
        $gte: dayjs(args.startOfToday).toDate(),
      },
      stoppedAt: {
        $lte: dayjs(args.endOfToday).toDate(),
      },
    });

    const todayTimesheets = await Timesheet.find(
      {
        userId: user._id,
        startedAt: {
          $gte: dayjs(args.startOfToday).toDate(),
        },
        stoppedAt: {
          $lte: dayjs(args.endOfToday).toDate(),
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
