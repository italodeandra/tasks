import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import { clientListApi } from "./list";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import getClient, { IClient } from "../../../collections/client";
import createApi from "@italodeandra/next/api/createApi";

export const clientCreateApi = createApi(
  "/api/client/create",
  async function (
    args: Jsonify<Pick<IClient, "name">>,
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    await connectDb();
    const Client = getClient();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const inserted = await Client.insertOne({
      name: args.name,
      userId: user._id,
    });

    return { _id: inserted._id };
  },
  {
    mutationOptions: {
      onSuccess(_d, _v, _c, queryClient) {
        void clientListApi.invalidate(queryClient);
      },
    },
  }
);

export default clientCreateApi.handler;
