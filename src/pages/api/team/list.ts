import createApi from "@italodeandra/next/api/createApi";
import { unauthorized } from "@italodeandra/next/api/errors";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { connectDb } from "../../../db";
import getTeam, { MemberRole } from "../../../collections/team";
import asyncMap from "@italodeandra/next/utils/asyncMap";

export const teamListApi = createApi(
  "/api/team/list",
  async (_args: void, req, res) => {
    await connectDb();
    const Team = getTeam();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    return asyncMap(
      await Team.find(
        {
          "members.userId": {
            $in: [user._id],
          },
        },
        {
          projection: {
            name: 1,
            members: 1,
          },
        },
      ),
      async ({ members, ...team }) => {
        return {
          ...team,
          canEdit: members.some(
            (m) => m.userId.equals(user._id) && m.role === MemberRole.ADMIN,
          ),
        };
      },
    );
  },
);

export default teamListApi.handler;

export type TeamListApi = typeof teamListApi.Types;
