import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import { taskListApi } from "./list";
import { connectDb } from "../../../db";
import getTask, { ITask } from "../../../collections/task";
import { projectListApi } from "../project/list";
import removeEmptyProperties from "@italodeandra/next/utils/removeEmptyProperties";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import getProject from "../../../collections/project";
import dayjs from "dayjs";
import createApi from "@italodeandra/next/api/createApi";

export const taskInsertApi = createApi(
  "/api/task/insert",
  async function handler(
    args: Jsonify<Pick<ITask, "_id" | "status" | "projectId">> & {
      bottom?: boolean;
    },
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    await connectDb();
    const Task = getTask();
    const Project = getProject();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    let order = 0;
    if (!args.bottom) {
      const firstTask = await Task.findOne(
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
      if (firstTask) {
        order = firstTask.order - 1;
      }
    } else {
      const lastTask = await Task.findOne(
        {
          userId: user._id,
          status: args.status,
        },
        {
          sort: {
            order: -1,
          },
          projection: {
            order: 1,
          },
        }
      );
      if (lastTask) {
        order = lastTask.order + 1;
      }
    }

    const projectId = args.projectId
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

    const doc = {
      _id: isomorphicObjectId(args._id),
      userId: user._id,
      status: args.status,
      order,
      projectId,
    };

    removeEmptyProperties(doc);

    await Task.insertOne({
      ...doc,
      title: "",
    });
  },
  {
    mutationOptions: {
      async onMutate({ bottom, ...variables }, queryClient) {
        await taskListApi.cancelQueries(queryClient);
        const previousData = taskListApi.getQueryData(queryClient);
        const newTask = {
          ...variables,
          createdAt: dayjs().toISOString(),
          titleHtml: "",
          title: "",
        };
        taskListApi.setQueryData(queryClient, (data) => [
          ...(!bottom
            ? [
                {
                  ...newTask,
                  order: 0,
                },
              ]
            : []),
          ...(data?.map((t) =>
            t.status === variables.status
              ? { ...t, order: !bottom ? t.order + 1 : t.order }
              : t
          ) || []),
          ...(bottom
            ? [
                {
                  ...newTask,
                  order: data?.length || 0,
                },
              ]
            : []),
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

export default taskInsertApi.handler;
