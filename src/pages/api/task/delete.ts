import { NextApiRequest, NextApiResponse } from "next";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { notFound, unauthorized } from "@italodeandra/next/api/errors";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import {
  apiHandlerWrapper,
  InferApiArgs,
  InferApiResponse,
  mutationFnWrapper,
} from "@italodeandra/next/api/apiHandlerWrapper";
import { invalidate_taskList } from "./list";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import Project, { IProject } from "../../../collections/project";
import { connectDb } from "../../../db";

async function handler(
  args: Jsonify<Pick<IProject, "_id">>,
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDb();
  let user = await getUserFromCookies(req, res);
  if (!user) {
    throw unauthorized;
  }

  let _id = isomorphicObjectId(args._id);

  if (
    (await Project.countDocuments({
      _id,
      userId: user._id,
    })) === 0
  ) {
    throw notFound;
  }

  await Project.deleteOne({
    _id,
    userId: user._id,
  });
}

export default apiHandlerWrapper(handler);

export type ProjectDeleteResponse = InferApiResponse<typeof handler>;
export type ProjectDeleteArgs = InferApiArgs<typeof handler>;

const mutationKey = "/api/project/delete";

export const useProjectDelete = (
  options?: UseMutationOptions<
    ProjectDeleteResponse,
    unknown,
    ProjectDeleteArgs
  >
) => {
  const queryClient = useQueryClient();
  return useMutation(
    [mutationKey],
    mutationFnWrapper<ProjectDeleteArgs, ProjectDeleteResponse>(mutationKey),
    {
      ...options,
      async onSuccess(...params) {
        await invalidate_taskList(queryClient);
        await options?.onSuccess?.(...params);
      },
    }
  );
};
