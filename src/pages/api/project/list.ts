import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import createApi from "@italodeandra/next/api/createApi";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import { connectDb } from "../../../db";
import getProject, { IProject } from "../../../collections/project";
import { ITask } from "../../../collections/task";

export const projectListApi = createApi(
  "/api/project/list",
  async function (_args: void, req: NextApiRequest, res: NextApiResponse) {
    await connectDb();
    let Project = getProject();
    let user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    return Project.aggregate<
      Pick<IProject, "name" | "_id"> & {
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
        },
      },
    ]);
  }
);

export default projectListApi.handler;

export type ProjectListApi = typeof projectListApi.Types;
