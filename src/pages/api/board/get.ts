import createApi from "@italodeandra/next/api/createApi";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { notFound, unauthorized } from "@italodeandra/next/api/errors";
import { connectDb } from "../../../db";
import getBoard from "../../../collections/board";
import getTeam from "../../../collections/team";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { PermissionLevel } from "../../../collections/permission";

export const boardGetApi = createApi(
  "/api/board/get",
  async (args: { _id: string }, req, res) => {
    await connectDb();
    const Board = getBoard();
    const Team = getTeam();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }
    const userTeams = await Team.find(
      { members: { $in: [user._id] } },
      { projection: { _id: 1 } },
    );
    const userTeamsIds = userTeams.map((t) => t._id);
    const board = await Board.findOne(
      {
        _id: isomorphicObjectId(args._id),
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
          name: 1,
          "permissions.level": 1,
        },
      },
    );
    if (!board) {
      throw notFound;
    }
    return {
      _id: board._id.toString(),
      name: board.name,
      canEdit: board.permissions.some((p) => p.level === PermissionLevel.ADMIN),
    };
  },
  {
    queryKeyMap: (args) => [args?._id],
  },
);

export default boardGetApi.handler;
