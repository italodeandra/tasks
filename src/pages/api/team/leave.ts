import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import createApi from "@italodeandra/next/api/createApi";
import getTeam, { ITeam } from "../../../collections/team";
import { teamListApi } from "./list";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { teamGetApi } from "./get";

export const teamLeaveApi = createApi(
  "/api/team/leave",
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

    await Team.updateOne(
      {
        _id,
      },
      {
        $pull: {
          members: { userId: user._id },
        },
      },
    );
  },
  {
    mutationOptions: {
      onSuccess(_d, variables, _c, queryClient) {
        void teamListApi.invalidateQueries(queryClient);
        void teamGetApi.invalidateQueries(queryClient, variables);
      },
    },
  },
);

export default teamLeaveApi.handler;