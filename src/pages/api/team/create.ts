import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import createApi from "@italodeandra/next/api/createApi";
import getTeam, { ITeam, MemberRole } from "../../../collections/team";
import { teamListApi } from "./list";

export const teamCreateApi = createApi(
  "/api/team/create",
  async function (
    args: Jsonify<Pick<ITeam, "name">>,
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    await connectDb();
    const Team = getTeam();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    await Team.insertOne({
      name: args.name,
      members: [
        {
          userId: user._id,
          role: MemberRole.ADMIN,
        },
      ],
    });
  },
  {
    mutationOptions: {
      async onSuccess(_d, _v, _c, queryClient) {
        await teamListApi.invalidateQueries(queryClient);
      },
    },
  },
);

export default teamCreateApi.handler;
