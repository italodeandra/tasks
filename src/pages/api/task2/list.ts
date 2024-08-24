import createApi from "@italodeandra/next/api/createApi";
import { unauthorized } from "@italodeandra/next/api/errors";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import getTask from "../../../collections/task2";
import { connectDb } from "../../../db";
import getTaskStatus from "../../../collections/taskStatus";
import asyncMap from "@italodeandra/next/utils/asyncMap";

export const taskListApi = createApi(
  "/api/task2/list",
  async (_args: void, req, res) => {
    await connectDb();
    const Task = getTask();
    const TaskStatus = getTaskStatus();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const status = await TaskStatus.find(
      {},
      {
        sort: {
          order: 1,
        },
        projection: {
          title: 1,
        },
      },
    );

    return asyncMap(status, async (s) => {
      const tasks = await Task.find(
        {
          statusId: s._id,
        },
        {
          projection: {
            title: 1,
          },
        },
      );

      return {
        ...s,
        tasks,
      } as typeof s & { tasks?: typeof tasks };
    });
  },
);

export default taskListApi.handler;
