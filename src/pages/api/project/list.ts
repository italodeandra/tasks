import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import createApi from "@italodeandra/next/api/createApi";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import { connectDb } from "../../../db";
import getProject, { IProject } from "../../../collections/project";
import getTask, { ITask } from "../../../collections/task";
import getClient, { IClient } from "../../../collections/client";
import querify from "@italodeandra/next/utils/querify";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";

export const projectListApi = createApi(
  "/api/project/list",
  async function (
    args: { clientsIds?: string[] },
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    await connectDb();
    const Project = getProject();
    const Task = getTask();
    const Client = getClient();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const query = querify(args);

    const clientsIds = query.clientsIds?.split(",").filter(Boolean);

    return Project.aggregate<
      Pick<IProject, "name" | "_id"> & {
        lastTaskUpdatedAt: ITask["updatedAt"];
        client?: Pick<IClient, "_id" | "name">;
      }
    >([
      {
        $match: {
          userId: user._id,
          archived: {
            $ne: true,
          },
          ...(clientsIds?.length
            ? {
                clientId: {
                  $in: clientsIds.map(isomorphicObjectId),
                },
              }
            : {}),
        },
      },
      {
        $lookup: {
          from: Client.collection.collectionName,
          localField: "clientId",
          foreignField: "_id",
          as: "client",
          pipeline: [
            {
              $project: {
                name: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$client",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: Task.collection.collectionName,
          localField: "_id",
          foreignField: "projectId",
          as: "lastUpdatedTask",
          pipeline: [
            {
              $sort: {
                updatedAt: -1,
              },
            },
            {
              $limit: 1,
            },
            {
              $project: {
                updatedAt: 1,
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
          "lastUpdatedTask.updatedAt": -1,
          updatedAt: -1,
        },
      },
      {
        $project: {
          name: 1,
          client: 1,
        },
      },
    ]);
  },
  {
    queryKeyMap: (args) => [args?.clientsIds],
  }
);

export default projectListApi.handler;

export type ProjectListApi = typeof projectListApi.Types;
