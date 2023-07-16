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
import { invalidate_taskList } from "../task/list";
import Timesheet, { ITimesheet } from "../../../collections/timesheet";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import ms from "ms";

async function handler(
  args: Jsonify<
    Pick<ITimesheet, "taskId" | "projectId" | "type"> & {
      time: string;
    }
  >,
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDb();
  let user = await getUserFromCookies(req, res);
  if (!user) {
    throw unauthorized;
  }

  await Timesheet.insertOne({
    taskId: args.taskId ? isomorphicObjectId(args.taskId) : undefined,
    userId: user._id,
    projectId: isomorphicObjectId(args.projectId),
    type: args.type,
    time: args.time ? ms(args.time) : undefined,
  });
}

export default apiHandlerWrapper(handler);

export type TimesheetAddApiResponse = InferApiResponse<typeof handler>;
export type TimesheetAddApiArgs = InferApiArgs<typeof handler>;

const mutationKey = "/api/timesheet/add";

export const useTimesheetAdd = (
  options?: UseMutationOptions<
    TimesheetAddApiResponse,
    unknown,
    TimesheetAddApiArgs
  >
) => {
  const queryClient = useQueryClient();
  return useMutation(
    [mutationKey],
    mutationFnWrapper<TimesheetAddApiArgs, TimesheetAddApiResponse>(
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
