import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import { taskListApi } from "./list";
import { connectDb } from "../../../db";
import getTask, { ITask } from "../../../collections/task";
import { invalidate_projectList } from "../project/list";
import removeEmptyProperties from "@italodeandra/next/utils/removeEmptyProperties";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import getProject from "../../../collections/project";
import dayjs from "dayjs";
import createApi from "@italodeandra/next/api/createApi";

export const taskInsertApi = createApi(
  "/api/task/insert",
  async function handler(
    args: Jsonify<Pick<ITask, "_id" | "status" | "projectId">>,
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
      _id: isomorphicObjectId(args._id),
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
  },
  {
    mutationOptions: {
      async onMutate(variables, queryClient) {
        await taskListApi.cancelQueries(queryClient);
        const previousData = taskListApi.getQueryData(queryClient);
        taskListApi.setQueryData(queryClient, (data) => [
          {
            ...variables,
            createdAt: dayjs().toISOString(),
            titleHtml: "",
            title: "",
            order: 0,
          },
          ...(data?.map((t) =>
            t.status === variables.status ? { ...t, order: t.order + 1 } : t
          ) || []),
        ]);
        return {
          previousData,
        };
      },
      onError: (_e, _v, context, queryClient) => {
        taskListApi.setQueryData(queryClient, context?.previousData);
      },
      onSuccess: (_d, _v, _c, queryClient) => {
        void invalidate_projectList(queryClient);
      },
      onSettled: (_d, _e, _v, _c, queryClient) => {
        void taskListApi.invalidate(queryClient);
      },
    },
  }
);

export default taskInsertApi.handler;
