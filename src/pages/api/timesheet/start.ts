import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import {
  apiHandlerWrapper,
  InferApiArgs,
  InferApiResponse,
  mutationFnWrapper,
} from "@italodeandra/next/api/apiHandlerWrapper";
import { unauthorized } from "@italodeandra/next/api/errors";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { NextApiRequest, NextApiResponse } from "next";
import { connectDb } from "../../../db";
import Task from "../../../collections/task";
import { invalidate_taskList } from "../task/list";
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

  await Task.updateOne(
    {
      _id,
    },
    {
      $set: {
        "timesheet.currentClockIn": new Date(),
      },
    }
  );
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
