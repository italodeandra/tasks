import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import createApi from "@italodeandra/next/api/createApi";
import getTeam, { ITeam, MemberRole } from "../../../collections/team";
import { teamListApi } from "./list";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import removeEmptyProperties from "@italodeandra/next/utils/removeEmptyProperties";
import { teamGetApi } from "./get";

export const teamUpdateApi = createApi(
  "/api/team/update",
  async function (
    args: Jsonify<
      Pick<ITeam, "_id"> & Partial<Pick<ITeam, "name" | "members">>
    >,
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

    const canEditTeam = await Team.countDocuments({
      _id,
      "members.role": MemberRole.ADMIN,
      "members.userId": {
        $in: [user._id],
      },
    });

    if (!canEditTeam) {
      throw unauthorized;
    }

    const $set = {
      name: args.name,
      members: args.members?.map((m) => ({
        ...m,
        userId: isomorphicObjectId(m.userId),
      })),
    };

    removeEmptyProperties($set);

    await Team.updateOne(
      {
        _id,
      },
      {
        $set,
      },
    );
  },
  {
    mutationOptions: {
      async onSuccess(_d, variables, _c, queryClient) {
        void teamGetApi.invalidateQueries(queryClient, variables);
        await teamListApi.invalidateQueries(queryClient);
      },
    },
  },
);

export default teamUpdateApi.handler;
