import createApi from "@italodeandra/next/api/createApi";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { notFound, unauthorized } from "@italodeandra/next/api/errors";
import { connectDb } from "../../../db";
import getTimesheet from "../../../collections/timesheet";
import { timesheetGetTaskOverviewApi } from "./get-task-overview";
import { timesheetGetMyOverviewApi } from "./get-my-overview";
import getTaskActivity, {
  ActivityType,
} from "../../../collections/taskActivity";
import { taskActivityListApi } from "../task-activity/list";

export const timesheetStopApi = createApi(
  "/api/timesheet/stop",
  async (_args: void, req, res) => {
    await connectDb();
    const user = await getUserFromCookies(req, res);
    const Timesheet = getTimesheet();
    const TaskActivity = getTaskActivity();
    if (!user) {
      throw unauthorized;
    }

    const timesheet = await Timesheet.findOne(
      {
        userId: user._id,
        stoppedAt: {
          $exists: false,
        },
        startedAt: {
          $exists: true,
        },
      },
      {
        projection: {
          startedAt: 1,
          taskId: 1,
        },
      },
    );
    if (!timesheet) {
      throw notFound;
    }

    const stoppedAt = new Date();

    await Timesheet.updateOne(
      {
        _id: timesheet._id,
      },
      {
        $set: {
          stoppedAt,
          time: stoppedAt.getTime() - timesheet.startedAt!.getTime(),
        },
      },
    );

    await TaskActivity.insertOne({
      userId: user._id,
      taskId: timesheet.taskId!,
      type: ActivityType.TIMESHEET,
      data: {
        time: stoppedAt.getTime() - timesheet.startedAt!.getTime(),
      },
    });

    return {
      taskId: timesheet.taskId,
    };
  },
  {
    mutationOptions: {
      async onSuccess(data, _v, _c, queryClient) {
        if (data.taskId) {
          void taskActivityListApi.invalidateQueries(queryClient, {
            taskId: data.taskId,
          });
        }
        await timesheetGetTaskOverviewApi.invalidateQueries(queryClient);
        await timesheetGetMyOverviewApi.invalidateQueries(queryClient);
      },
    },
  },
);

export default timesheetStopApi.handler;
