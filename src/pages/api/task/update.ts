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
import { invalidate_taskList } from "./list";
import { connectDb } from "../../../db";
import getTask, { ITask } from "../../../collections/task";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import { invalidate_projectList } from "../project/list";
import removeEmptyProperties from "@italodeandra/next/utils/removeEmptyProperties";
import type { StrictUpdateFilter } from "mongodb";
import { WritableDeep } from "type-fest";
import getProject from "../../../collections/project";

async function handler(
  args: Pick<Jsonify<Partial<ITask>>, "_id" | "content" | "projectId">,
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDb();
  let Task = getTask();
  let Project = getProject();
  let user = await getUserFromCookies(req, res);
  if (!user) {
    throw unauthorized;
  }

  const _id = isomorphicObjectId(args._id);

  let $set = {
    content: args.content,
    projectId:
      args.projectId && args.projectId !== "NONE"
        ? isomorphicObjectId(args.projectId)
        : undefined,
  };
  let $unset: WritableDeep<StrictUpdateFilter<ITask>["$unset"]> = {};

  removeEmptyProperties($set);

  if (args.projectId === "NONE") {
    delete $set.projectId;
    $unset.projectId = "";
  }

  if ($set.projectId) {
    await Project.updateOne(
      { _id: $set.projectId },
      {
        $set: {
          updatedAt: new Date(),
        },
      }
    );
  }

  await Task.updateOne(
    {
      _id,
      userId: user._id,
    },
    {
      $set,
      $unset,
    }
  );
}

export default apiHandlerWrapper(handler);

export type TaskUpdateResponse = InferApiResponse<typeof handler>;
export type TaskUpdateArgs = InferApiArgs<typeof handler>;

const mutationKey = "/api/task/update";

export const useTaskUpdate = (
  options?: UseMutationOptions<TaskUpdateResponse, unknown, TaskUpdateArgs>
) => {
  const queryClient = useQueryClient();
  return useMutation(
    [mutationKey],
    mutationFnWrapper<TaskUpdateArgs, TaskUpdateResponse>(mutationKey),
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
