import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import createApi from "@italodeandra/next/api/createApi";
import getTeam, { ITeam } from "../../../collections/team";
import { teamListApi } from "./list";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { boardGetApi } from "../board/get";

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
      async onSuccess(_d, _v, _c, queryClient) {
        void boardGetApi.invalidateQueries(queryClient);
        await teamListApi.invalidateQueries(queryClient);
      },
    },
  },
);

export default teamLeaveApi.handler;
