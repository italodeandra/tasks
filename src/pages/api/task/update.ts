import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import createApi from "@italodeandra/next/api/createApi";
import { unauthorized } from "@italodeandra/next/api/errors";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { NextApiRequest, NextApiResponse } from "next";
import { taskListApi } from "./list";
import { connectDb } from "../../../db";
import getTask, { ITask } from "../../../collections/task";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import { invalidate_projectList } from "../project/list";
import removeEmptyProperties from "@italodeandra/next/utils/removeEmptyProperties";
import getProject from "../../../collections/project";
import { pick } from "lodash";
import { taskGetApi } from "./get";

export const taskUpdateApi = createApi(
  "/api/task/update",
  async (
    args: Jsonify<
      Pick<
        Partial<ITask>,
        "title" | "description" | "projectId" | "status" | "order"
      > & {
        _id: string;
      }
    >,
    req: NextApiRequest,
    res: NextApiResponse
  ) => {
    await connectDb();
    let Task = getTask();
    let Project = getProject();
    let user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const _id = isomorphicObjectId(args._id);

    let $set: Partial<ITask> = {
      ...pick(args, ["title", "description", "status", "order"]),
    };
    if (args.projectId && args.projectId !== "NONE") {
      $set.projectId = isomorphicObjectId(args.projectId);
    }
    let $unset = removeEmptyProperties($set);

    if (args.projectId === "NONE") {
      delete $set.projectId;
      $unset.projectId = "";
    }

    if ($set.projectId) {
      await Project.updateOne(
        { _id: $set.projectId },
        {
          $set: {
            updatedAt: new Date(),
          },
        }
      );
    }

    await Task.updateOne(
      {
        _id,
        userId: user._id,
      },
      {
        $set,
        $unset,
      }
    );
  },
  {
    mutationOptions: {
      async onMutate(args, queryClient) {
        await taskListApi.cancelQueries(queryClient);
        const previousTaskListData = taskListApi.getQueryData(queryClient);
        taskListApi.setQueryData(queryClient, (data) => [
          ...(data?.map((t) => (t._id === args._id ? { ...t, ...args } : t)) ||
            []),
        ]);

        await taskGetApi.cancelQueries(queryClient, args);
        const previousTaskGetData = taskGetApi.getQueryData(queryClient, args);
        taskGetApi.setQueryData(
          queryClient,
          (data) =>
            data && {
              ...data,
              ...args,
            },
          args
        );

        return {
          previousTaskListData,
          previousTaskGetData,
        };
      },
      onError: (_e, args, context, queryClient) => {
        taskListApi.setQueryData(queryClient, context?.previousTaskListData);
        taskGetApi.setQueryData(
          queryClient,
          context?.previousTaskGetData,
          args
        );
      },
      onSuccess: (_d, _v, _c, queryClient) => {
        void invalidate_projectList(queryClient);
      },
      onSettled: (_d, _e, args, _c, queryClient) => {
        void taskListApi.invalidate(queryClient);
        void taskGetApi.invalidate(queryClient, args);
      },
    },
  }
);

export default taskUpdateApi.handler;
