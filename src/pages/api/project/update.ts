import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import {
  apiHandlerWrapper,
  InferApiArgs,
  InferApiResponse,
  mutationFnWrapper,
} from "@italodeandra/next/api/apiHandlerWrapper";
import { notFound, unauthorized } from "@italodeandra/next/api/errors";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { NextApiRequest, NextApiResponse } from "next";
import { ProjectCreateArgs } from "./create";
import { invalidate_projectList } from "./list";
import { connectDb } from "../../../db";
import Project from "../../../collections/project";

async function handler(
  args: { _id: string } & ProjectCreateArgs,
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDb();
  const user = await getUserFromCookies(req, res);
  if (!user) {
    throw unauthorized;
  }

  const assetId = isomorphicObjectId(args._id);

  const updatedMovie = await Project.findOneAndUpdate(
    {
      _id: assetId,
      userId: user._id,
    },
    {
      $set: {
        name: args.name,
        color: args.color,
      },
    }
  );

  if (!updatedMovie) {
    throw notFound;
  }

  return { _id: updatedMovie._id };
}

export default apiHandlerWrapper(handler);

export type ProjectUpdateResponse = InferApiResponse<typeof handler>;
export type ProjectUpdateArgs = InferApiArgs<typeof handler>;

const mutationKey = "/api/project/update";

export const useProjectUpdate = (
  options?: UseMutationOptions<
    ProjectUpdateResponse,
    unknown,
    ProjectUpdateArgs
  >
) => {
  const queryClient = useQueryClient();
  return useMutation(
    [mutationKey],
    mutationFnWrapper<ProjectUpdateArgs, ProjectUpdateResponse>(mutationKey),
    {
      ...options,
      async onSuccess(...params) {
        await invalidate_projectList(queryClient);
        await options?.onSuccess?.(...params);
      },
    }
  );
};
