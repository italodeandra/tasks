import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import {
  apiHandlerWrapper,
  InferApiArgs,
  InferApiResponse,
  mutationFnWrapper,
} from "@italodeandra/next/api/apiHandlerWrapper";
import {
  badRequest,
  notFound,
  unauthorized,
} from "@italodeandra/next/api/errors";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { NextApiRequest, NextApiResponse } from "next";
import { connectDb } from "../../../db";
import getTask from "../../../collections/task";
import { taskListApi } from "../task/list";
import { ObjectId } from "bson";
import getTimesheet, { TimesheetType } from "../../../collections/timesheet";
import { stopClock } from "./stop";
import getProject from "../../../collections/project";
import { invalidate_projectList } from "../project/list";
import { timesheetStatusApi } from "./status";
import { taskGetApi } from "../task/get";

async function handler(
  args: {
    _id: string | ObjectId;
  },
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDb();
  let Task = getTask();
  let Timesheet = getTimesheet();
  let Project = getProject();
  let user = await getUserFromCookies(req, res);
  if (!user) {
    throw unauthorized;
  }

  let _id = isomorphicObjectId(args._id);

  let task = await Task.findById(_id);
  if (!task) {
    throw notFound;
  }

  let activeTimesheet = await Timesheet.countDocuments({
    userId: user._id,
    taskId: task._id,
    startedAt: {
      $exists: true,
    },
    stoppedAt: {
      $exists: false,
    },
  });
  if (activeTimesheet) {
    throw badRequest;
  }

  await stopClock(user._id);

  let taskId = task._id;
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

  let projectId = task.projectId;
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

  await Timesheet.insertOne({
    taskId,
    userId: user._id,
    projectId,
    type: TimesheetType.CLOCK_IN_OUT,
    startedAt: new Date(),
  });
}

export default apiHandlerWrapper(handler);

export type TimesheetStartApiResponse = InferApiResponse<typeof handler>;
export type TimesheetStartApiArgs = InferApiArgs<typeof handler>;

const mutationKey = "/api/timesheet/start";

export const useTimesheetStart = (
  options?: UseMutationOptions<
    TimesheetStartApiResponse,
    unknown,
    TimesheetStartApiArgs
  >
) => {
  const queryClient = useQueryClient();
  return useMutation(
    [mutationKey],
    mutationFnWrapper<TimesheetStartApiArgs, TimesheetStartApiResponse>(
      mutationKey
    ),
    {
      ...options,
      onSuccess(...params) {
        void taskListApi.invalidate(queryClient);
        void invalidate_projectList(queryClient);
        void timesheetStatusApi.invalidate(queryClient);
        void taskGetApi.invalidate(queryClient);
        return options?.onSuccess?.(...params);
      },
    }
  );
};
