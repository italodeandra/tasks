import createApi from "@italodeandra/next/api/createApi";
import { unauthorized } from "@italodeandra/next/api/errors";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { connectDb } from "../../../db";
import getTeam from "../../../collections/team";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import getBoard from "../../../collections/board";
import getTaskStatus from "../../../collections/taskStatus";

export const taskStatusListApi = createApi(
  "/api/task-status/list",
  async (args: { boardId: string }, req, res) => {
    await connectDb();
    const TaskStatus = getTaskStatus();
    const Team = getTeam();
    const Board = getBoard();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }
    const userTeams = await Team.find(
      { "members.userId": { $in: [user._id] } },
      { projection: { _id: 1 } },
    );
    const userTeamsIds = userTeams.map((t) => t._id);
    const boardId = isomorphicObjectId(args.boardId);

    const haveAccessToBoard = await Board.countDocuments({
      _id: boardId,
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
    });

    if (!haveAccessToBoard) {
      throw unauthorized;
    }

    return TaskStatus.find(
      {
        boardId,
      },
      {
        projection: {
          title: 1,
        },
      },
    );
  },
  {
    queryKeyMap: (args) => [args?.boardId],
  },
);

export default taskStatusListApi.handler;
