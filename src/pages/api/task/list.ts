import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import {
  apiHandlerWrapper,
  InferApiArgs,
  InferApiResponse,
  queryFnWrapper,
} from "@italodeandra/next/api/apiHandlerWrapper";
import { unauthorized } from "@italodeandra/next/api/errors";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { NextApiRequest, NextApiResponse } from "next";
import { connectDb } from "../../../db";
import Task, { TaskStatus } from "../../../collections/task";
import showdown from "showdown";
import dayjs from "dayjs";

let converter = new showdown.Converter({
  simplifiedAutoLink: true,
  strikethrough: true,
});

async function handler(args: void, req: NextApiRequest, res: NextApiResponse) {
  await connectDb();
  const user = await getUserFromCookies(req, res);
  if (!user) {
    throw unauthorized;
  }

  return (
    await Task.find(
      {
        userId: user._id,
        $or: [
          {
            status: {
              $ne: TaskStatus.DONE,
            },
          },
          {
            status: TaskStatus.DONE,
            updatedAt: {
              $gte: dayjs().subtract(1, "week").toDate(),
            },
          },
        ],
      },
      {
        projection: {
          content: 1,
          status: 1,
          projectId: 1,
          order: 1,
          "timesheet.time": 1,
          "timesheet.currentClockIn": 1,
        },
        sort: {
          status: 1,
          order: 1,
        },
      }
    )
  ).map((t) => ({ ...t, html: converter.makeHtml(t.content) }));
}

export default apiHandlerWrapper(handler);

export type TaskListApiArgs = InferApiArgs<typeof handler>;
export type TaskListApiResponse = InferApiResponse<typeof handler>;

const queryKey = "/api/task/list";

export const useTaskList = (args?: TaskListApiArgs) =>
  useQuery([queryKey], queryFnWrapper<TaskListApiResponse>(queryKey, args));

export const invalidate_taskList = (queryClient: QueryClient) =>
  queryClient.invalidateQueries([queryKey]);
