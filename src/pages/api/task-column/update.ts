import createApi from "@italodeandra/next/api/createApi";
import { notFound, unauthorized } from "@italodeandra/next/api/errors";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { connectDb } from "../../../db";
import getTeam from "../../../collections/team";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import getBoard from "../../../collections/board";
import getTaskColumn from "../../../collections/taskColumn";
import { taskColumnListApi } from "./list";

export const taskColumnUpdateApi = createApi(
  "/api/task-column/update",
  async (args: { _id: string; linkedStatusId: string }, req, res) => {
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

    const _id = isomorphicObjectId(args._id);
    const column = await TaskColumn.findById(_id, {
      projection: {
        boardId: 1,
      },
    });
    if (!column) {
      throw notFound;
    }

    const haveAccessToBoard = await Board.countDocuments({
      _id: column.boardId,
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

    await TaskColumn.updateOne(
      {
        _id,
      },
      {
        $set: {
          linkedStatusId: isomorphicObjectId(args.linkedStatusId),
        },
      },
    );

    return {
      boardId: column.boardId,
    };
  },
  {
    mutationOptions: {
      async onSuccess(data, _v, _c, queryClient) {
        await taskColumnListApi.invalidateQueries(queryClient, data);
      },
    },
  },
);

export default taskColumnUpdateApi.handler;
