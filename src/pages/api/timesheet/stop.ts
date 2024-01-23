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
import { invalidate_taskList } from "../task/list";
import { ObjectId } from "bson";
import getTimesheet from "../../../collections/timesheet";
import { invalidate_timesheetStatus } from "./status";

export async function stopClock(userId: ObjectId) {
  let Timesheet = getTimesheet();
  let activeTimesheet = await Timesheet.findOne({
    userId: userId,
    startedAt: {
      $exists: true,
    },
    stoppedAt: {
      $exists: false,
    },
  });
  if (activeTimesheet?.startedAt) {
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
}

async function handler(_args: void, req: NextApiRequest, res: NextApiResponse) {
  await connectDb();
  let user = await getUserFromCookies(req, res);
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
      async onSuccess(...params) {
        await invalidate_taskList(queryClient);
        await invalidate_timesheetStatus(queryClient);
        await options?.onSuccess?.(...params);
      },
    }
  );
};
