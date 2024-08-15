import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { conflict, unauthorized } from "@italodeandra/next/api/errors";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { NextApiRequest, NextApiResponse } from "next";
import { taskListApi } from "./list";
import { connectDb } from "../../../db";
import getTask, { ITask } from "../../../collections/task";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import { projectListApi } from "../project/list";
import createApi from "@italodeandra/next/api/createApi";
import getTimesheet from "../../../collections/timesheet";

export const taskRemoveApi = createApi(
  "/api/task/remove",
  async function handler(
    args: Pick<Jsonify<Partial<ITask>>, "_id">,
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    await connectDb();
    const Task = getTask();
    const Timesheet = getTimesheet();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const _id = isomorphicObjectId(args._id);

    const existingTimesheet = await Timesheet.countDocuments({
      taskId: _id,
      userId: user._id,
    });
    if (existingTimesheet) {
      throw conflict;
    }

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
        void projectListApi.invalidateQueries(queryClient);
      },
      onSettled: (_d, _e, _v, _c, queryClient) => {
        void taskListApi.invalidateQueries(queryClient);
      },
    },
  }
);

export default taskRemoveApi.handler;
