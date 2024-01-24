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
import getTask, { ITask } from "../../../collections/task";
import { invalidate_projectList } from "../project/list";
import removeEmptyProperties from "@italodeandra/next/utils/removeEmptyProperties";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import getProject from "../../../collections/project";

async function handler(
  args: Jsonify<Pick<ITask, "status" | "projectId">>,
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

  let projectId = args.projectId
    ? isomorphicObjectId(args.projectId)
    : undefined;

  if (projectId) {
    await Project.updateOne(
      { _id: projectId },
      {
        $set: {
          updatedAt: new Date(),
        },
      }
    );
  }

  let doc = {
    userId: user._id,
    status: args.status,
    order: (firstTask?.order || 0) - 1,
    projectId,
  };

  removeEmptyProperties(doc);

  await Task.insertOne({
    ...doc,
    title: "",
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
