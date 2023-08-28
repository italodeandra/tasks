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
import { invalidate_taskList } from "../task/list";
import { ObjectId } from "bson";
import getTimesheet, { TimesheetType } from "../../../collections/timesheet";

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

  await Timesheet.insertOne({
    taskId: task._id,
    userId: user._id,
    projectId: task.projectId,
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
      async onSuccess(...params) {
        await invalidate_taskList(queryClient);
        await options?.onSuccess?.(...params);
      },
    }
  );
};
