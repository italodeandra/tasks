import createApi from "@italodeandra/next/api/createApi";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { connectDb } from "../../../db";
import getBoard from "../../../collections/board";
import getTeam from "../../../collections/team";

export const boardListApi = createApi(
  "/api/board/list",
  async (_args: void, req, res) => {
    await connectDb();
    const Board = getBoard();
    const Team = getTeam();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }
    const userTeams = await Team.find(
      { "members.userId": { $in: [user._id] } },
      { projection: { _id: 1 } },
    );
    const userTeamsIds = userTeams.map((t) => t._id);
    return Board.find(
      {
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
        },
      },
    );
  },
);

export default boardListApi.handler;
