import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import createApi from "@italodeandra/next/api/createApi";
import { notFound, unauthorized } from "@italodeandra/next/api/errors";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { NextApiRequest, NextApiResponse } from "next";
import { taskListApi } from "./list";
import { connectDb } from "../../../db";
import getTask, { ITask } from "../../../collections/task";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import { projectListApi } from "../project/list";
import removeEmptyProperties from "@italodeandra/next/utils/removeEmptyProperties";
import getProject from "../../../collections/project";
import { omit, pick } from "lodash-es";
import { taskGetApi } from "./get";
import getTimesheet from "../../../collections/timesheet";

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
    res: NextApiResponse,
  ) => {
    await connectDb();
    const Task = getTask();
    const Project = getProject();
    const Timesheet = getTimesheet();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const _id = isomorphicObjectId(args._id);
    const oldTask = await Task.findOne({ _id, userId: user._id });
    if (!oldTask) {
      throw notFound;
    }

    const $set: Partial<ITask> = {
      ...pick(args, ["title", "description", "status", "order"]),
    };
    if (args.projectId && args.projectId !== "NONE") {
      $set.projectId = isomorphicObjectId(args.projectId);
    }
    const $unset = removeEmptyProperties($set);

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
        },
      );
    }

    const newTask = (await Task.findOneAndUpdate(
      {
        _id,
        userId: user._id,
      },
      {
        $set,
        $unset,
      },
    ))!;

    if (!newTask.projectId || !oldTask.projectId?.equals(newTask.projectId)) {
      await Timesheet.updateMany(
        {
          taskId: _id,
          userId: user._id,
        },
        newTask.projectId
          ? {
              $set: {
                projectId: newTask.projectId,
              },
            }
          : {
              $unset: {
                projectId: "",
              },
            },
      );
    }
  },
  {
    mutationOptions: {
      async onMutate(args, queryClient) {
        await taskListApi.cancelQueries(queryClient);
        const previousTaskListData = taskListApi.getQueryData(queryClient);
        taskListApi.setQueryData(queryClient, (data) => [
          ...(data?.map((t) =>
            t._id === args._id ? { ...t, ...omit(args, "description") } : t,
          ) || []),
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
          args,
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
          args,
        );
      },
      onSuccess: (_d, _v, _c, queryClient) => {
        void projectListApi.invalidateQueries(queryClient);
      },
      onSettled: (_d, _e, args, _c, queryClient) => {
        void taskListApi.invalidateQueries(queryClient);
        void taskGetApi.invalidateQueries(queryClient, args);
      },
    },
  },
);

export default taskUpdateApi.handler;
