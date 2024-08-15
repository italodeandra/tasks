import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { notFound, unauthorized } from "@italodeandra/next/api/errors";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { clientListApi } from "./list";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import getClient, { IClient } from "../../../collections/client";
import { connectDb } from "../../../db";
import getTask from "../../../collections/task";
import createApi from "@italodeandra/next/api/createApi";
import getProject from "../../../collections/project";

export const clientArchiveApi = createApi(
  "/api/client/archive",
  async function (
    args: Jsonify<Pick<IClient, "_id">>,
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    await connectDb();
    const Client = getClient();
    const Project = getProject();
    const Task = getTask();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const _id = isomorphicObjectId(args._id);

    if (
      !(await Client.countDocuments({
        _id,
        userId: user._id,
      }))
    ) {
      throw notFound;
    }

    if (
      await Task.countDocuments({
        userId: user._id,
        projectId: {
          $in: (
            await Project.find(
              {
                clientId: _id,
              },
              {
                projection: {
                  _id: 1,
                },
              },
            )
          ).map((p) => p._id),
        },
      })
    ) {
      await Client.updateOne(
        {
          _id,
          userId: user._id,
        },
        {
          $set: {
            archived: true,
          },
        },
      );
    } else {
      await Client.deleteOne({
        _id,
        userId: user._id,
      });
    }
  },
  {
    mutationOptions: {
      onSuccess(_d, _v, _c, queryClient) {
        void clientListApi.invalidateQueries(queryClient);
      },
    },
  },
);

export default clientArchiveApi.handler;
