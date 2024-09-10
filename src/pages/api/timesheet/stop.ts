import createApi from "@italodeandra/next/api/createApi";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { notFound, unauthorized } from "@italodeandra/next/api/errors";
import { connectDb } from "../../../db";
import getTimesheet, { ITimesheet } from "../../../collections/timesheet";
import { timesheetGetTaskOverviewApi } from "./get-task-overview";
import { timesheetGetMyOverviewApi } from "./get-my-overview";
import getTaskActivity, {
  ActivityType,
} from "../../../collections/taskActivity";
import { taskActivityListApi } from "../task-activity/list";
import { ObjectId } from "bson";

export async function stopTask(
  timesheet: Pick<ITimesheet, "_id" | "startedAt" | "taskId">,
  userId: ObjectId,
) {
  const Timesheet = getTimesheet();
  const TaskActivity = getTaskActivity();

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
    userId,
    taskId: timesheet.taskId!,
    type: ActivityType.TIMESHEET,
    data: {
      time: stoppedAt.getTime() - timesheet.startedAt!.getTime(),
    },
  });
}

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

    await stopTask(timesheet, user._id);

    return {
      taskId: timesheet.taskId,
    };
  },
  {
    mutationOptions: {
      onSuccess(data, _v, _c, queryClient) {
        if (data.taskId) {
          void taskActivityListApi.invalidateQueries(queryClient, {
            taskId: data.taskId,
          });
        }
        void timesheetGetTaskOverviewApi.invalidateQueries(queryClient);
        void timesheetGetMyOverviewApi.invalidateQueries(queryClient);
      },
    },
  },
);

export default timesheetStopApi.handler;
