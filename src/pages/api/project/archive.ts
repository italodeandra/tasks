import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { notFound, unauthorized } from "@italodeandra/next/api/errors";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { projectListApi } from "./list";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import getProject, { IProject } from "../../../collections/project";
import { connectDb } from "../../../db";
import getTask from "../../../collections/task";
import createApi from "@italodeandra/next/api/createApi";

export const projectArchiveApi = createApi(
  "/api/project/archive",
  async function (
    args: Jsonify<Pick<IProject, "_id">>,
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    await connectDb();
    let Project = getProject();
    let Task = getTask();
    let user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    let _id = isomorphicObjectId(args._id);

    if (
      (await Project.countDocuments({
        _id,
        userId: user._id,
      })) === 0
    ) {
      throw notFound;
    }

    if (
      await Task.countDocuments({
        userId: user._id,
        projectId: _id,
      })
    ) {
      await Project.updateOne(
        {
          _id,
          userId: user._id,
        },
        {
          $set: {
            archived: true,
          },
        }
      );
    } else {
      await Project.deleteOne({
        _id,
        userId: user._id,
      });
    }
  },
  {
    mutationOptions: {
      onSuccess(_d, _v, _c, queryClient) {
        void projectListApi.invalidate(queryClient);
      },
    },
  }
);

export default projectArchiveApi.handler;
