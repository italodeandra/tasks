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
import { taskListApi } from "../task/list";
import { ObjectId } from "bson";
import getTimesheet from "../../../collections/timesheet";
import { timesheetStatusApi } from "./status";
import { timesheetListFromProjectApi } from "./list-from-project";

async function handler(
  args: {
    _id: string | ObjectId;
  },
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDb();
  const Timesheet = getTimesheet();
  const user = await getUserFromCookies(req, res);
  if (!user) {
    throw unauthorized;
  }

  const _id = isomorphicObjectId(args._id);

  await Timesheet.deleteOne({
    _id,
    userId: user._id,
  });
}

export default apiHandlerWrapper(handler);

export type TimesheetDeleteApiResponse = InferApiResponse<typeof handler>;
export type TimesheetDeleteApiArgs = InferApiArgs<typeof handler>;

const mutationKey = "/api/timesheet/delete";

export const useTimesheetDelete = (
  options?: UseMutationOptions<
    TimesheetDeleteApiResponse,
    unknown,
    TimesheetDeleteApiArgs
  >
) => {
  const queryClient = useQueryClient();
  return useMutation(
    [mutationKey],
    mutationFnWrapper<TimesheetDeleteApiArgs, TimesheetDeleteApiResponse>(
      mutationKey
    ),
    {
      ...options,
      onSuccess(...params) {
        void taskListApi.invalidateQueries(queryClient);
        void timesheetStatusApi.invalidateQueries(queryClient);
        void timesheetListFromProjectApi.invalidateQueries(queryClient);
        return options?.onSuccess?.(...params);
      },
    }
  );
};
