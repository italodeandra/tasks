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
import Task, { ITask } from "../../../collections/task";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import { invalidate_projectList } from "../project/list";

async function handler(
  args: Pick<
    Jsonify<Partial<ITask>>,
    "_id" | "content" | "projectId" | "status" | "order"
  >,
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDb();
  const user = await getUserFromCookies(req, res);
  if (!user) {
    throw unauthorized;
  }

  const _id = isomorphicObjectId(args._id);
  const projectId = args.projectId
    ? isomorphicObjectId(args.projectId)
    : undefined;

  if (args.status) {
    let task = await Task.findOne({
      _id,
      userId: user._id,
    });

    await Task.findOneAndUpdate(
      {
        _id,
        userId: user._id,
      },
      {
        $set: {
          content: args.content,
          projectId,
          status: args.status,
          projectUpdatedAt:
            args.projectId === task?.projectId?.toString()
              ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                task!.projectUpdatedAt
              : new Date(),
        },
        $setOnInsert: {
          _id,
          userId: user._id,
          order: Infinity,
        },
      },
      {
        upsert: true,
      }
    );
  } else {
    await Task.deleteOne({
      _id,
      userId: user._id,
    });
  }
}

export default apiHandlerWrapper(handler);

export type TaskUpsertResponse = InferApiResponse<typeof handler>;
export type TaskUpsertArgs = InferApiArgs<typeof handler>;

const mutationKey = "/api/task/upsert";

export const useTaskUpsert = (
  options?: UseMutationOptions<TaskUpsertResponse, unknown, TaskUpsertArgs>
) => {
  const queryClient = useQueryClient();
  return useMutation(
    [mutationKey],
    mutationFnWrapper<TaskUpsertArgs, TaskUpsertResponse>(mutationKey),
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

export const useTaskIsUpserting = () => !!useIsMutating([mutationKey]);
