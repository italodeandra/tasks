import createApi from "@italodeandra/next/api/createApi";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { notFound, unauthorized } from "@italodeandra/next/api/errors";
import { connectDb } from "../../../db";
import getBoard from "../../../collections/board";
import getTeam from "../../../collections/team";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import asyncMap from "@italodeandra/next/utils/asyncMap";
import getUser from "@italodeandra/auth/collections/user/User";

export const boardGetPermissionsApi = createApi(
  "/api/board/get-permissions",
  async (args: { _id: string }, req, res) => {
    await connectDb();
    const Board = getBoard();
    const Team = getTeam();
    const User = getUser();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }
    const userTeams = await Team.find(
      { "members.userId": { $in: [user._id] } },
      { projection: { _id: 1 } },
    );
    const userTeamsIds = userTeams.map((t) => t._id);
    const _id = isomorphicObjectId(args._id);
    const board = await Board.findOne(
      {
        _id,
        $or: [
          {
            "permissions.userId": {
              $in: [user._id],
            },
          },
          {
            "permissions.teamId": {
              $in: userTeamsIds,
            },
          },
        ],
      },
      {
        projection: {
          permissions: 1,
        },
      },
    );
    if (!board) {
      throw notFound;
    }
    return asyncMap(
      board.permissions,
      async ({ userId, teamId, ...permission }) => ({
        ...permission,
        user: userId
          ? {
              ...(await User.findById(userId, {
                projection: { name: 1, email: 1, profilePicture: 1 },
              }))!,
              isMe: userId?.equals(user._id),
            }
          : undefined,
        team: teamId
          ? await Team.findById(teamId, { projection: { name: 1 } })
          : undefined,
      }),
    );
  },
  {
    queryKeyMap: (args) => [args?._id],
  },
);

export default boardGetPermissionsApi.handler;

export type BoardGetPermissionsApi = typeof boardGetPermissionsApi.Types;
