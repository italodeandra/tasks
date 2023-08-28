import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import {
  apiHandlerWrapper,
  InferApiArgs,
  InferApiResponse,
  mutationFnWrapper,
} from "@italodeandra/next/api/apiHandlerWrapper";
import { notFound, unauthorized } from "@italodeandra/next/api/errors";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { NextApiRequest, NextApiResponse } from "next";
import { connectDb } from "../../../db";
import getTask from "../../../collections/task";
import { invalidate_taskList } from "../task/list";
import { ObjectId } from "bson";
import getTimesheet from "../../../collections/timesheet";

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
  let user = await getUserFromCookies(req, res);
  if (!user) {
    throw unauthorized;
  }

  let _id = isomorphicObjectId(args._id);

  let task = await Task.findById(_id);
  if (!task) {
    throw notFound(res, { task: _id });
  }

  let activeTimesheet = await Timesheet.findOne({
    userId: user._id,
    taskId: task._id,
    startedAt: {
      $exists: true,
    },
    stoppedAt: {
      $exists: false,
    },
  });
  if (!activeTimesheet?.startedAt) {
    throw notFound(res, {
      userId: user._id,
      taskId: task._id,
      timesheetId: activeTimesheet?._id,
    });
  }

  let stoppedAt = new Date();
  let addedTime = stoppedAt.getTime() - activeTimesheet.startedAt.getTime();

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
      async onSuccess(...params) {
        await invalidate_taskList(queryClient);
        await options?.onSuccess?.(...params);
      },
    }
  );
};
