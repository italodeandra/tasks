import createApi from "@italodeandra/next/api/createApi";
import { unauthorized } from "@italodeandra/next/api/errors";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { connectDb } from "../../../db";
import getTeam from "../../../collections/team";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import getBoard from "../../../collections/board";
import getTaskColumn from "../../../collections/taskColumn";

export const taskColumnListApi = createApi(
  "/api/task-column/list",
  async (args: { boardId: string }, req, res) => {
    await connectDb();
    const TaskColumn = getTaskColumn();
    const Team = getTeam();
    const Board = getBoard();
    const user = await getUserFromCookies(req, res);

    const userTeams = user
      ? await Team.find(
          { "members.userId": { $in: [user._id] } },
          { projection: { _id: 1 } },
        )
      : undefined;
    const userTeamsIds = userTeams?.map((t) => t._id);
    const boardId = isomorphicObjectId(args.boardId);

    const haveAccessToBoard = await Board.countDocuments({
      _id: boardId,
      $or: [
        ...(user
          ? [
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
            ]
          : []),
        {
          "permissions.public": true,
        },
      ],
    });

    if (!haveAccessToBoard) {
      throw unauthorized;
    }

    return TaskColumn.find(
      {
        boardId,
      },
      {
        sort: {
          order: 1,
        },
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

export default taskColumnListApi.handler;
