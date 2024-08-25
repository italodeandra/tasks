import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import createApi from "@italodeandra/next/api/createApi";
import getProject, { IProject } from "../../../collections/project2";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { clientListWithProjectsApi } from "../client2/list-with-projects";
import getClient from "../../../collections/client2";

export const projectCreateApi = createApi(
  "/api/project2/create",
  async function (
    args: Jsonify<Pick<IProject, "name" | "clientId">>,
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    await connectDb();
    const Project = getProject();
    const Client = getClient();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const clientId = args.clientId
      ? isomorphicObjectId(args.clientId)
      : undefined;

    await Project.insertOne({
      name: args.name,
      clientId,
    });

    if (args.clientId) {
      await Client.updateOne(
        {
          _id: clientId,
        },
        {
          $set: {},
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

export default projectCreateApi.handler;
