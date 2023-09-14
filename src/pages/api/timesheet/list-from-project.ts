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
import getTimesheet, { ITimesheet } from "../../../collections/timesheet";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { ITask } from "../../../collections/task";
import removeMd from "remove-markdown";

async function handler(
  args: { projectId: string },
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDb();
  let Timesheet = getTimesheet();
  let user = await getUserFromCookies(req, res);
  if (!user) {
    throw unauthorized;
  }

  let projectId = isomorphicObjectId(args.projectId);

  return (
    await Timesheet.aggregate<
      Pick<ITimesheet, "_id" | "time" | "startedAt" | "type" | "createdAt"> & {
        task?: Pick<ITask, "_id" | "content">;
      }
    >([
      {
        $match: {
          userId: user._id,
          projectId: projectId,
        },
      },
      {
        $lookup: {
          from: "tasks",
          localField: "taskId",
          foreignField: "_id",
          as: "task",
          pipeline: [
            {
              $project: {
                content: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$task",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          time: 1,
          startedAt: 1,
          createdAt: 1,
          type: 1,
          task: 1,
        },
      },
      {
        $sort: {
          createdAt: 1,
        },
      },
    ])
  ).map((t) => ({
    ...t,
    task: t.task && {
      ...t.task,
      content: removeMd(t.task?.content).split("\n")[0],
    },
  }));
}

export default apiHandlerWrapper(handler);

export type TimesheetListFromProjectApiArgs = InferApiArgs<typeof handler>;
export type TimesheetListFromProjectApiResponse = InferApiResponse<
  typeof handler
>;

const queryKey = "/api/timesheet/list-from-project";

export const useTimesheetListFromProject = (
  args: TimesheetListFromProjectApiArgs
) =>
  useQuery(
    [queryKey, args.projectId],
    queryFnWrapper<TimesheetListFromProjectApiResponse>(queryKey, args)
  );

export const invalidate_timesheetListFromProject = (queryClient: QueryClient) =>
  queryClient.invalidateQueries([queryKey]);
