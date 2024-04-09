import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import {
  apiHandlerWrapper,
  InferApiArgs,
  InferApiResponse,
  mutationFnWrapper,
} from "@italodeandra/next/api/apiHandlerWrapper";
import { unauthorized } from "@italodeandra/next/api/errors";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { NextApiRequest, NextApiResponse } from "next";
import { connectDb } from "../../../db";
import { taskListApi } from "../task/list";
import getTimesheet, { ITimesheet } from "../../../collections/timesheet";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import ms from "ms";
import getTask from "../../../collections/task";
import getProject from "../../../collections/project";
import { invalidate_projectList } from "../project/list";
import { timesheetStatusApi } from "./status";
import { timesheetListFromProjectApi } from "./list-from-project";

async function handler(
  args: Jsonify<
    Pick<ITimesheet, "taskId" | "projectId" | "type" | "description"> & {
      time: string;
    }
  >,
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDb();
  const Timesheet = getTimesheet();
  const Task = getTask();
  const Project = getProject();
  const user = await getUserFromCookies(req, res);
  if (!user) {
    throw unauthorized;
  }

  const taskId = args.taskId ? isomorphicObjectId(args.taskId) : undefined;
  if (taskId) {
    await Task.updateOne(
      { _id: taskId },
      {
        $set: {
          updatedAt: new Date(),
        },
      }
    );
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

  await Timesheet.insertOne({
    taskId,
    userId: user._id,
    projectId,
    type: args.type,
    time: args.time ? ms(args.time) : undefined,
    description: args.description,
  });
}

export default apiHandlerWrapper(handler);

export type TimesheetAddApiResponse = InferApiResponse<typeof handler>;
export type TimesheetAddApiArgs = InferApiArgs<typeof handler>;

const mutationKey = "/api/timesheet/add";

export const useTimesheetAdd = (
  options?: UseMutationOptions<
    TimesheetAddApiResponse,
    unknown,
    TimesheetAddApiArgs
  >
) => {
  const queryClient = useQueryClient();
  return useMutation(
    [mutationKey],
    mutationFnWrapper<TimesheetAddApiArgs, TimesheetAddApiResponse>(
      mutationKey
    ),
    {
      ...options,
      onSuccess(...params) {
        void taskListApi.invalidate(queryClient);
        void invalidate_projectList(queryClient);
        void timesheetStatusApi.invalidate(queryClient);
        void timesheetListFromProjectApi.invalidate(queryClient);
        return options?.onSuccess?.(...params);
      },
    }
  );
};
