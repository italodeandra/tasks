import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import createApi from "@italodeandra/next/api/createApi";
import getProject, { IProject } from "../../../collections/project2";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { clientListWithProjectsApi } from "../client2/list-with-projects";
import getTask from "../../../collections/task2";

export const projectDeleteApi = createApi(
  "/api/project2/delete",
  async function (
    args: Jsonify<Pick<IProject, "_id">>,
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    await connectDb();
    const Project = getProject();
    const Task = getTask();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const _id = isomorphicObjectId(args._id);

    if (!(await Task.countDocuments({ projectId: _id }))) {
      await Project.deleteOne({
        _id,
      });
    } else {
      await Project.updateOne(
        {
          _id,
        },
        {
          $set: {
            archived: true,
          },
        },
      );
    }
  },
  {
    mutationOptions: {
      onSuccess(_d, _v, _c, queryClient) {
        void clientListWithProjectsApi.invalidateQueries(queryClient);
      },
    },
  },
);

export default projectDeleteApi.handler;
