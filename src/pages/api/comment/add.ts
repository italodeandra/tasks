import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import { commentListApi } from "./list";
import { connectDb } from "../../../db";
import { projectListApi } from "../project/list";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import createApi from "@italodeandra/next/api/createApi";
import getComment, { IComment } from "../../../collections/comment";

export const commentAddApi = createApi(
  "/api/comment/add",
  async function handler(
    args: Jsonify<Pick<IComment, "_id" | "taskId" | "content">>,
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    await connectDb();
    const Comment = getComment();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    await Comment.insertOne({
      _id: isomorphicObjectId(args._id),
      taskId: isomorphicObjectId(args.taskId),
      content: args.content,
      authorId: user._id,
    });
  },
  {
    mutationOptions: {
      async onMutate(variables, queryClient) {
        await commentListApi.cancelQueries(queryClient);
        const previousData = commentListApi.getQueryData(queryClient);
        commentListApi.setQueryData(queryClient, (data) => [
          {
            ...variables,
            createdAt: new Date().toISOString(),
          },
          ...(data || []),
        ]);
        return {
          previousData,
        };
      },
      onError: (_e, _v, context, queryClient) => {
        commentListApi.setQueryData(queryClient, context?.previousData);
      },
      onSuccess: (_d, _v, _c, queryClient) => {
        void projectListApi.invalidate(queryClient);
      },
      onSettled: (_d, _e, _v, _c, queryClient) => {
        void commentListApi.invalidate(queryClient);
      },
    },
  }
);

export default commentAddApi.handler;
