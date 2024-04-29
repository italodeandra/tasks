import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import {
  apiHandlerWrapper,
  InferApiArgs,
  InferApiResponse,
  mutationFnWrapper,
} from "@italodeandra/next/api/apiHandlerWrapper";
import { unauthorized } from "@italodeandra/next/api/errors";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { NextApiRequest, NextApiResponse } from "next";
import { connectDb } from "../../../db";
import { taskListApi } from "../task/list";
import { ObjectId } from "bson";
import getTimesheet from "../../../collections/timesheet";
import getTask from "../../../collections/task";
import getProject from "../../../collections/project";
import { projectListApi } from "../project/list";
import { timesheetStatusApi } from "./status";
import { taskGetApi } from "../task/get";
import { timesheetListFromProjectApi } from "./list-from-project";

export async function stopClock(userId: ObjectId) {
  const Timesheet = getTimesheet();
  const Task = getTask();
  const Project = getProject();
  const activeTimesheet = await Timesheet.findOne({
    userId: userId,
    startedAt: {
      $exists: true,
    },
    stoppedAt: {
      $exists: false,
    },
  });
  if (activeTimesheet?.startedAt) {
    const stoppedAt = new Date();
    const addedTime = stoppedAt.getTime() - activeTimesheet.startedAt.getTime();

    const taskId = activeTimesheet.taskId;
    if (taskId) {
      await Task.updateOne(
        { _id: taskId },
        {
          $set: {
            updatedAt: new Date(),
          },
        }
      );
    }

    const projectId = activeTimesheet.projectId;
    if (projectId) {
      await Project.updateOne(
        { _id: projectId },
        {
          $set: {
            updatedAt: new Date(),
          },
        }
      );
    }

    await Timesheet.updateOne(
      {
        _id: activeTimesheet._id,
      },
      {
        $set: {
          stoppedAt,
          time: (activeTimesheet.time || 0) + addedTime,
        },
      }
    );
  }
}

async function handler(_args: void, req: NextApiRequest, res: NextApiResponse) {
  await connectDb();
  const user = await getUserFromCookies(req, res);
  if (!user) {
    throw unauthorized;
  }

  await stopClock(user._id);
}

export default apiHandlerWrapper(handler);

export type TimesheetStopApiResponse = InferApiResponse<typeof handler>;
export type TimesheetStopApiArgs = InferApiArgs<typeof handler>;

const mutationKey = "/api/timesheet/stop";

export const useTimesheetStop = (
  options?: UseMutationOptions<
    TimesheetStopApiResponse,
    unknown,
    TimesheetStopApiArgs
  >
) => {
  const queryClient = useQueryClient();
  return useMutation(
    [mutationKey],
    mutationFnWrapper<TimesheetStopApiArgs, TimesheetStopApiResponse>(
      mutationKey
    ),
    {
      ...options,
      onSuccess(...params) {
        void taskListApi.invalidateQueries(queryClient);
        void projectListApi.invalidateQueries(queryClient);
        void timesheetStatusApi.invalidateQueries(queryClient);
        void taskGetApi.invalidateQueries(queryClient);
        void timesheetListFromProjectApi.invalidateQueries(queryClient);
        return options?.onSuccess?.(...params);
      },
    }
  );
};
