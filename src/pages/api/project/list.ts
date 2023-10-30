import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import {
  apiHandlerWrapper,
  InferApiResponse,
  queryFnWrapper,
} from "@italodeandra/next/api/apiHandlerWrapper";
import { unauthorized } from "@italodeandra/next/api/errors";
import { QueryClient, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { NextApiRequest, NextApiResponse } from "next";
import { connectDb } from "../../../db";
import getProject, { IProject } from "../../../collections/project";
import { ITask } from "../../../collections/task";

async function handler(args: void, req: NextApiRequest, res: NextApiResponse) {
  await connectDb();
  let Project = getProject();
  let user = await getUserFromCookies(req, res);
  if (!user) {
    throw unauthorized;
  }

  return Project.aggregate<
    Pick<IProject, "name" | "color" | "_id"> & {
      lastTaskUpdatedAt: ITask["updatedAt"];
    }
  >([
    {
      $match: {
        userId: user._id,
        archived: {
          $ne: true,
        },
      },
    },
    {
      $lookup: {
        from: "tasks",
        localField: "_id",
        foreignField: "projectId",
        as: "lastUpdatedTask",
        pipeline: [
          {
            $sort: {
              projectUpdatedAt: -1,
            },
          },
          {
            $limit: 1,
          },
          {
            $project: {
              projectUpdatedAt: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$lastUpdatedTask",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $sort: {
        "lastUpdatedTask.projectUpdatedAt": -1,
        updatedAt: -1,
      },
    },
    {
      $project: {
        name: 1,
        color: 1,
      },
    },
  ]);
}

export default apiHandlerWrapper(handler);

export type ProjectListApiResponse = InferApiResponse<typeof handler>;

const queryKey = "/api/project/list";

export const useProjectList = (
  options?: UseQueryOptions<ProjectListApiResponse>
) =>
  useQuery<ProjectListApiResponse>(
    [queryKey],
    queryFnWrapper(queryKey),
    options
  );

export const invalidate_projectList = (queryClient: QueryClient) =>
  queryClient.invalidateQueries([queryKey]);
