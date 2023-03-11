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
  useIsMutating,
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { NextApiRequest, NextApiResponse } from "next";
import { invalidate_taskList } from "./list";
import { connectDb } from "../../../db";
import Task, { ITask, TaskStatus } from "../../../collections/task";
import Jsonify from "@italodeandra/next/utils/Jsonify";

async function handler(
  argsList: Pick<
    Jsonify<Partial<ITask>>,
    "_id" | "content" | "projectId" | "status" | "order"
  >[],
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDb();
  const user = await getUserFromCookies(req, res);
  if (!user) {
    throw unauthorized;
  }

  return Promise.all(
    argsList.map(async (args) => {
      const _id = isomorphicObjectId(args._id);

      const updated = await Task.findOneAndUpdate(
        {
          _id,
          userId: user._id,
        },
        {
          $set: {
            order: args.order,
          },
        }
      );

      return updated ? { _id: updated._id } : null;
    })
  );
}

export default apiHandlerWrapper(handler);

export type TaskBatchUpdateOrderResponse = InferApiResponse<typeof handler>;
export type TaskBatchUpdateOrderArgs = InferApiArgs<typeof handler>;

const mutationKey = "/api/task/batchUpdateOrder";

export const useTaskBatchUpdateOrder = (
  status: TaskStatus,
  options?: UseMutationOptions<
    TaskBatchUpdateOrderResponse,
    unknown,
    TaskBatchUpdateOrderArgs
  >
) => {
  const queryClient = useQueryClient();
  return useMutation(
    [mutationKey, status],
    mutationFnWrapper<TaskBatchUpdateOrderArgs, TaskBatchUpdateOrderResponse>(
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

export const useTaskIsBatchUpdatingOrder = (status: TaskStatus) =>
  !!useIsMutating([mutationKey, status]);
