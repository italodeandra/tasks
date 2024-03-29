import { connectDb } from "../../../db";
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
import { invalidate_projectList } from "./list";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import getProject, { IProject } from "../../../collections/project";

async function handler(
  args: Jsonify<Pick<IProject, "color" | "name">>,
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDb();
  let Project = getProject();
  const user = await getUserFromCookies(req, res);
  if (!user) {
    throw unauthorized;
  }

  const inserted = await Project.insertOne({
    name: args.name,
    color: args.color,
    userId: user._id,
  });

  return { _id: inserted._id };
}

export default apiHandlerWrapper(handler);

export type ProjectCreateResponse = InferApiResponse<typeof handler>;
export type ProjectCreateArgs = InferApiArgs<typeof handler>;

const mutationKey = "/api/project/create";

export const useProjectCreate = (
  options?: UseMutationOptions<
    ProjectCreateResponse,
    unknown,
    ProjectCreateArgs
  >
) => {
  const queryClient = useQueryClient();
  return useMutation(
    [mutationKey],
    mutationFnWrapper<ProjectCreateArgs, ProjectCreateResponse>(mutationKey),
    {
      ...options,
      async onSuccess(...params) {
        await invalidate_projectList(queryClient);
        await options?.onSuccess?.(...params);
      },
    }
  );
};
