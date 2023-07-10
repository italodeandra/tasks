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
import { connectDb } from "../../../../db";
import Task from "../../../../collections/task";
import { invalidate_taskList } from "../list";
import { ObjectId } from "bson";

async function handler(
  args: {
    _id: string | ObjectId;
  },
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDb();
  const user = await getUserFromCookies(req, res);
  if (!user) {
    throw unauthorized;
  }

  const _id = isomorphicObjectId(args._id);

  let task = await Task.findById(_id);

  if (!task?.timesheet?.currentClockIn) {
    throw notFound;
  }

  let stoppedAt = new Date();
  let addedTime = stoppedAt.getTime() - task.timesheet.currentClockIn.getTime();
  let startedAt = task.timesheet.currentClockIn;

  await Task.updateOne(
    {
      _id,
    },
    {
      $set: {
        "timesheet.time": (task.timesheet.time || 0) + addedTime,
      },
      $unset: {
        "timesheet.currentClockIn": "",
      },
      $addToSet: {
        "timesheet.history": {
          _id: isomorphicObjectId(),
          time: addedTime,
          startedAt,
          stoppedAt,
        },
      },
    }
  );
}

export default apiHandlerWrapper(handler);

export type TaskTimesheetStopApiResponse = InferApiResponse<typeof handler>;
export type TaskTimesheetStopApiArgs = InferApiArgs<typeof handler>;

const mutationKey = "/api/task/timesheet/stop";

export const useTaskTimesheetStop = (
  options?: UseMutationOptions<
    TaskTimesheetStopApiResponse,
    unknown,
    TaskTimesheetStopApiArgs
  >
) => {
  const queryClient = useQueryClient();
  return useMutation(
    [mutationKey],
    mutationFnWrapper<TaskTimesheetStopApiArgs, TaskTimesheetStopApiResponse>(
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
