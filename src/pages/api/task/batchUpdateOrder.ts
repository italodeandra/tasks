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
import { taskListApi } from "./list";
import { connectDb } from "../../../db";
import getTask, { ITask } from "../../../collections/task";
import Jsonify from "@italodeandra/next/utils/Jsonify";

async function handler(
  argsList: Pick<Jsonify<ITask>, "_id" | "status" | "order">[],
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDb();
  let Task = getTask();
  const user = await getUserFromCookies(req, res);
  if (!user) {
    throw unauthorized;
  }

  await Task.bulkWrite(
    argsList.map((args) => ({
      updateOne: {
        filter: {
          _id: isomorphicObjectId(args._id),
          userId: user._id,
          $or: [
            {
              order: { $ne: args.order },
            },
            {
              status: { $ne: args.status },
            },
          ],
        },
        update: {
          $set: {
            order: args.order,
            status: args.status,
          },
        },
      },
    }))
  );
}

export default apiHandlerWrapper(handler);

export type TaskBatchUpdateOrderResponse = InferApiResponse<typeof handler>;
export type TaskBatchUpdateOrderArgs = InferApiArgs<typeof handler>;

const mutationKey = "/api/task/batchUpdateOrder";

export const useTaskBatchUpdateOrder = (
  options?: UseMutationOptions<
    TaskBatchUpdateOrderResponse,
    unknown,
    TaskBatchUpdateOrderArgs
  >
) => {
  const queryClient = useQueryClient();
  return useMutation(
    [mutationKey],
    mutationFnWrapper<TaskBatchUpdateOrderArgs, TaskBatchUpdateOrderResponse>(
      mutationKey
    ),
    {
      ...options,
      async onSuccess(...params) {
        await taskListApi.invalidate(queryClient);
        await options?.onSuccess?.(...params);
      },
    }
  );
};
