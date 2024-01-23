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
import { invalidate_taskList } from "./list";
import { connectDb } from "../../../db";
import getTask, { TaskStatus } from "../../../collections/task";
import { invalidate_projectList } from "../project/list";

async function handler(
  args: {
    status: TaskStatus;
  },
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDb();
  let Task = getTask();
  let user = await getUserFromCookies(req, res);
  if (!user) {
    throw unauthorized;
  }

  let firstTask = await Task.findOne(
    {
      userId: user._id,
      status: args.status,
    },
    {
      sort: {
        order: 1,
      },
      projection: {
        order: 1,
      },
    }
  );

  await Task.insertOne({
    title: "",
    userId: user._id,
    status: args.status,
    order: (firstTask?.order || 0) - 1,
  });
}

export default apiHandlerWrapper(handler);

export type TaskInsertResponse = InferApiResponse<typeof handler>;
export type TaskInsertArgs = InferApiArgs<typeof handler>;

const mutationKey = "/api/task/insert";

export const useTaskInsert = (
  options?: UseMutationOptions<TaskInsertResponse, unknown, TaskInsertArgs>
) => {
  const queryClient = useQueryClient();
  return useMutation(
    [mutationKey],
    mutationFnWrapper<TaskInsertArgs, TaskInsertResponse>(mutationKey),
    {
      ...options,
      async onSuccess(...params) {
        await invalidate_taskList(queryClient);
        await invalidate_projectList(queryClient);
        await options?.onSuccess?.(...params);
      },
    }
  );
};
