import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import createApi from "@italodeandra/next/api/createApi";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import getProject, { IProject } from "../../../collections/project2";
import { clientListWithProjectsApi } from "../client2/list-with-projects";

export const projectUpdateApi = createApi(
  "/api/project2/update",
  async function (
    args: Jsonify<Pick<IProject, "_id" | "name">>,
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    await connectDb();
    const Project = getProject();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    await Project.updateOne(
      {
        _id: isomorphicObjectId(args._id),
      },
      {
        $set: {
          name: args.name,
        },
      },
    );
  },
  {
    mutationOptions: {
      onSuccess(_d, _v, _c, queryClient) {
        void clientListWithProjectsApi.invalidateQueries(queryClient);
      },
    },
  },
);

export default projectUpdateApi.handler;
