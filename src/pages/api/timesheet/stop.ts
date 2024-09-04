import createApi from "@italodeandra/next/api/createApi";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { notFound, unauthorized } from "@italodeandra/next/api/errors";
import { connectDb } from "../../../db";
import getTimesheet from "../../../collections/timesheet";
import { timesheetGetTaskOverviewApi } from "./get-task-overview";
import { timesheetGetMyOverviewApi } from "./get-my-overview";

export const timesheetStopApi = createApi(
  "/api/timesheet/stop",
  async (_args: void, req, res) => {
    await connectDb();
    const user = await getUserFromCookies(req, res);
    const Timesheet = getTimesheet();
    if (!user) {
      throw unauthorized;
    }

    const timesheet = await Timesheet.findOne(
      {
        userId: user._id,
        stoppedAt: {
          $exists: false,
        },
      },
      {
        projection: {
          startedAt: 1,
        },
      },
    );
    if (!timesheet) {
      throw notFound;
    }

    await Timesheet.updateOne(
      {
        _id: timesheet._id,
      },
      {
        $set: {
          stoppedAt: new Date(),
          time: new Date().getTime() - timesheet.startedAt.getTime(),
        },
      },
    );
  },
  {
    mutationOptions: {
      async onSuccess(_d, _v, _c, queryClient) {
        await timesheetGetTaskOverviewApi.invalidateQueries(queryClient);
        await timesheetGetMyOverviewApi.invalidateQueries(queryClient);
      },
    },
  },
);

export default timesheetStopApi.handler;
