import createApi from "@italodeandra/next/api/createApi";
import { notFound, unauthorized } from "@italodeandra/next/api/errors";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { connectDb } from "../../../db";
import getTeam, { MemberRole } from "../../../collections/team";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import getUser from "@italodeandra/auth/collections/user/User";
import asyncMap from "@italodeandra/next/utils/asyncMap";

export const teamGetApi = createApi(
  "/api/team/get",
  async (args: { _id: string }, req, res) => {
    await connectDb();
    const Team = getTeam();
    const User = getUser();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const team = await Team.findOne(
      {
        _id: isomorphicObjectId(args._id),
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
    );

    if (!team) {
      throw notFound;
    }

    return {
      _id: team._id,
      name: team.name,
      members: await asyncMap(team.members, async ({ userId, ...member }) => ({
        ...member,
        ...(await User.findOne(
          {
            _id: userId,
          },
          {
            projection: {
              name: 1,
              email: 1,
              profilePicture: 1,
            },
          },
        ))!,
        isMe: userId.equals(user._id),
      })),
      canEdit: team.members.some(
        (m) => m.userId.equals(user._id) && m.role === MemberRole.ADMIN,
      ),
    };
  },
  {
    queryKeyMap: (args) => [args?._id],
  },
);

export default teamGetApi.handler;

export type TeamGetApi = typeof teamGetApi.Types;
