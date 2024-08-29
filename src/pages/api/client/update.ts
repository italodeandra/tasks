import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import createApi from "@italodeandra/next/api/createApi";
import getClient, { IClient } from "../../../collections/client";
import { clientListWithProjectsApi } from "./list-with-projects";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";

export const clientUpdateApi = createApi(
  "/api/client/update",
  async function (
    args: Jsonify<Pick<IClient, "_id" | "name">>,
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    await connectDb();
    const Client = getClient();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    await Client.updateOne(
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

export default clientUpdateApi.handler;
