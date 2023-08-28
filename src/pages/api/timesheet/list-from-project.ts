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
import getTimesheet from "../../../collections/timesheet";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";

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

  return Timesheet.find(
    {
      userId: user._id,
      projectId: projectId,
    },
    {
      projection: {
        time: 1,
        startedAt: 1,
        type: 1,
      },
    }
  );
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
