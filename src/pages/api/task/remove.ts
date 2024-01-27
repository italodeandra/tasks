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
import { invalidate_projectList } from "../project/list";

async function handler(
  args: Pick<Jsonify<Partial<ITask>>, "_id">,
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDb();
  let Task = getTask();
  let user = await getUserFromCookies(req, res);
  if (!user) {
    throw unauthorized;
  }

  const _id = isomorphicObjectId(args._id);

  await Task.deleteOne({
    _id,
    userId: user._id,
  });
}

export default apiHandlerWrapper(handler);

export type TaskRemoveResponse = InferApiResponse<typeof handler>;
export type TaskRemoveArgs = InferApiArgs<typeof handler>;

const mutationKey = "/api/task/remove";

export const useTaskRemove = (
  options?: UseMutationOptions<TaskRemoveResponse, unknown, TaskRemoveArgs>
) => {
  const queryClient = useQueryClient();
  return useMutation(
    [mutationKey],
    mutationFnWrapper<TaskRemoveArgs, TaskRemoveResponse>(mutationKey),
    {
      ...options,
      onSuccess(...params) {
        void taskListApi.invalidate(queryClient);
        void invalidate_projectList(queryClient);
        return options?.onSuccess?.(...params);
      },
    }
  );
};
