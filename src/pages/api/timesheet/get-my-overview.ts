import createApi from "@italodeandra/next/api/createApi";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { connectDb } from "../../../db";
import getTimesheet from "../../../collections/timesheet";
import dayjs from "dayjs";
import { sumBy } from "lodash-es";

export const timesheetGetMyOverviewApi = createApi(
  "/api/timesheet/get-my-overview",
  async (_args: void, req, res) => {
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
          taskId: 1,
          startedAt: 1,
        },
      },
    );

    const todayTimesheets = await Timesheet.find(
      {
        userId: user._id,
        startedAt: {
          $gte: dayjs().startOf("day").toDate(),
        },
        stoppedAt: {
          $exists: true,
        },
      },
      {
        projection: {
          time: 1,
        },
      },
    );

    return {
      todayTime: sumBy(todayTimesheets, "time"),
      myCurrentClock: currentTimesheet?.startedAt,
    };
  },
);

export default timesheetGetMyOverviewApi.handler;
