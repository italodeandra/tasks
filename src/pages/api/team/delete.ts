import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { badRequest, unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import createApi from "@italodeandra/next/api/createApi";
import getTeam, { ITeam, MemberRole } from "../../../collections/team";
import { teamListApi } from "./list";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";

export const teamDeleteApi = createApi(
  "/api/team/delete",
  async function (
    args: Jsonify<Pick<ITeam, "_id">>,
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    await connectDb();
    const Team = getTeam();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const _id = isomorphicObjectId(args._id);

    const team = await Team.findOne(
      {
        _id,
      },
      {
        projection: {
          members: 1,
        },
      },
    );
    const canDeleteTeam = team?.members.every(
      (m) => m.userId.equals(user._id) && m.role === MemberRole.ADMIN,
    );

    if (!canDeleteTeam) {
      throw badRequest;
    }

    await Team.deleteOne({
      _id,
    });
  },
  {
    mutationOptions: {
      onSuccess(_d, _v, _c, queryClient) {
        void teamListApi.invalidateQueries(queryClient);
      },
    },
  },
);

export default teamDeleteApi.handler;
