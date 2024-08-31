import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import createApi from "@italodeandra/next/api/createApi";
import getTeam, { MemberRole } from "../../../collections/team";
import { teamListApi } from "./list";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { teamGetApi } from "./get";
import { boardGetApi } from "../board/get";

export const teamUpdateMemberRoleApi = createApi(
  "/api/team/update-member-role",
  async function (
    args: { teamId: string; userId: string; role: MemberRole | "remove" },
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    await connectDb();
    const Team = getTeam();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const teamId = isomorphicObjectId(args.teamId);
    const userId = isomorphicObjectId(args.userId);

    const canEditTeam = await Team.countDocuments({
      _id: teamId,
      "members.role": MemberRole.ADMIN,
      "members.userId": {
        $in: [user._id],
      },
    });

    if (!canEditTeam) {
      throw unauthorized;
    }

    const team = (await Team.findById(teamId, { projection: { members: 1 } }))!;

    await Team.updateOne(
      {
        _id: teamId,
      },
      {
        $set: {
          members: team.members
            .filter((m) => !m.userId.equals(userId) || args.role !== "remove")
            .map((m) => {
              if (m.userId.equals(userId)) {
                return {
                  ...m,
                  role: args.role as MemberRole,
                };
              }
              return m;
            }),
        },
      },
    );
  },
  {
    mutationOptions: {
      async onSuccess(_d, variables, _c, queryClient) {
        void teamListApi.invalidateQueries(queryClient);
        void boardGetApi.invalidateQueries(queryClient);
        await teamGetApi.invalidateQueries(queryClient, {
          _id: variables.teamId,
        });
      },
    },
  },
);

export default teamUpdateMemberRoleApi.handler;
