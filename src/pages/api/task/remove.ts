import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { NextApiRequest, NextApiResponse } from "next";
import { taskListApi } from "./list";
import { connectDb } from "../../../db";
import getTask, { ITask } from "../../../collections/task";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import { projectListApi } from "../project/list";
import createApi from "@italodeandra/next/api/createApi";

export const taskRemoveApi = createApi(
  "/api/task/remove",
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
  },
  {
    mutationOptions: {
      async onMutate(variables, queryClient) {
        await taskListApi.cancelQueries(queryClient);
        const previousData = taskListApi.getQueryData(queryClient);
        taskListApi.setQueryData(queryClient, (data) => [
          ...(data?.filter((t) => t._id !== variables._id) || []),
        ]);
        return {
          previousData,
        };
      },
      onError: (_e, _v, context, queryClient) => {
        taskListApi.setQueryData(queryClient, context?.previousData);
      },
      onSuccess: (_d, _v, _c, queryClient) => {
        void projectListApi.invalidate(queryClient);
      },
      onSettled: (_d, _e, _v, _c, queryClient) => {
        void taskListApi.invalidate(queryClient);
      },
    },
  }
);

export default taskRemoveApi.handler;
