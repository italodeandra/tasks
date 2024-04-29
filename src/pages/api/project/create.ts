import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import { projectListApi } from "./list";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import getProject, { IProject } from "../../../collections/project";
import createApi from "@italodeandra/next/api/createApi";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";

export const projectCreateApi = createApi(
  "/api/project/create",
  async function (
    args: Jsonify<Pick<IProject, "name" | "clientId">>,
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    await connectDb();
    const Project = getProject();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const inserted = await Project.insertOne({
      name: args.name,
      userId: user._id,
      ...(args.clientId
        ? {
            clientId: isomorphicObjectId(args.clientId),
          }
        : {}),
    });

    return { _id: inserted._id };
  },
  {
    mutationOptions: {
      onSuccess(_d, _v, _c, queryClient) {
        void projectListApi.invalidateQueries(queryClient);
      },
    },
  }
);

export default projectCreateApi.handler;
