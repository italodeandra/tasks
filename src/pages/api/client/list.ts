import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import createApi from "@italodeandra/next/api/createApi";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import { connectDb } from "../../../db";
import getClient, { IClient } from "../../../collections/client";
import getTask, { ITask } from "../../../collections/task";

export const clientListApi = createApi(
  "/api/client/list",
  async function (_a: void, req: NextApiRequest, res: NextApiResponse) {
    await connectDb();
    const Client = getClient();
    const Task = getTask();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    return Client.aggregate<
      Pick<IClient, "name" | "_id"> & {
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
          from: Task.collection.collectionName,
          localField: "_id",
          foreignField: "clientId",
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
        },
      },
    ]);
  }
);

export default clientListApi.handler;

export type ClientListApi = typeof clientListApi.Types;
