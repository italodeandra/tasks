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
import getTask, { TaskStatus } from "../../../collections/task";
import showdown from "showdown";
import dayjs from "dayjs";
import { invalidate_timesheetListFromProject } from "../timesheet/list-from-project";
import asyncMap from "@italodeandra/next/utils/asyncMap";
import getTimesheet from "../../../collections/timesheet";
import { sumBy } from "lodash";
import { invalidate_timesheetStatus } from "../timesheet/status";

let converter = new showdown.Converter({
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});

async function handler(_args: void, req: NextApiRequest, res: NextApiResponse) {
  await connectDb();
  let Task = getTask();
  let Timesheet = getTimesheet();
  const user = await getUserFromCookies(req, res);
  if (!user) {
    throw unauthorized;
  }

  return asyncMap(
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
            statusUpdatedAt: {
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
        },
        sort: {
          status: 1,
          order: 1,
        },
      }
    ),
    async (t) => ({
      ...t,
      timesheet: {
        currentClockIn: (
          await Timesheet.findOne(
            {
              userId: user._id,
              taskId: t._id,
              startedAt: {
                $exists: true,
              },
              stoppedAt: {
                $exists: false,
              },
            },
            {
              projection: {
                startedAt: 1,
              },
            }
          )
        )?.startedAt,
        time: sumBy(
          await Timesheet.find(
            {
              userId: user._id,
              taskId: t._id,
              time: {
                $exists: true,
              },
            },
            {
              projection: {
                time: 1,
              },
            }
          ),
          "time"
        ),
      },
      html: converter.makeHtml(t.content),
    })
  );
}

export default apiHandlerWrapper(handler);

export type TaskListApiArgs = InferApiArgs<typeof handler>;
export type TaskListApiResponse = InferApiResponse<typeof handler>;

const queryKey = "/api/task/list";

export const useTaskList = (args?: TaskListApiArgs) =>
  useQuery([queryKey], queryFnWrapper<TaskListApiResponse>(queryKey, args));

export const invalidate_taskList = async (queryClient: QueryClient) => {
  await invalidate_timesheetListFromProject(queryClient);
  await invalidate_timesheetStatus(queryClient);
  return queryClient.invalidateQueries([queryKey]);
};
