import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import createApi from "@italodeandra/next/api/createApi";
import getClient, { IClient } from "../../../collections/client2";
import { clientListWithProjectsApi } from "./list-with-projects";

export const clientCreateApi = createApi(
  "/api/client2/create",
  async function (
    args: Jsonify<Pick<IClient, "name">>,
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    await connectDb();
    const Client = getClient();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    await Client.insertOne({
      name: args.name,
      participants: {
        usersIds: [user._id],
      },
    });
  },
  {
    mutationOptions: {
      onSuccess(_d, _v, _c, queryClient) {
        void clientListWithProjectsApi.invalidateQueries(queryClient);
      },
    },
  },
);

export default clientCreateApi.handler;
