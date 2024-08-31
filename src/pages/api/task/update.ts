import createApi from "@italodeandra/next/api/createApi";
import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { notFound, unauthorized } from "@italodeandra/next/api/errors";
import getTaskColumn from "../../../collections/taskColumn";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import getTask, { ITask } from "../../../collections/task";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import getTeam from "../../../collections/team";
import getBoard from "../../../collections/board";
import removeEmptyProperties from "@italodeandra/next/utils/removeEmptyProperties";
import { taskGetApi } from "./get";
import { taskListApi } from "./list";

export const taskUpdateApi = createApi(
  "/api/task/update",
  async (
    args: Jsonify<
      { _id: string } & Partial<
        Pick<ITask, "statusId" | "columnId" | "description">
      >
    >,
    req,
    res,
  ) => {
    await connectDb();
    const Task = getTask();
    const TaskColumn = getTaskColumn();
    const Team = getTeam();
    const Board = getBoard();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const _id = isomorphicObjectId(args._id);

    const task = await Task.findById(_id, {
      projection: {
        columnId: 1,
        statusId: 1,
      },
    });
    if (!task) {
      throw notFound;
    }

    const column = await TaskColumn.findById(task.columnId, {
      projection: {
        boardId: 1,
      },
    });
    if (!column) {
      throw notFound;
    }

    const userTeams = await Team.find(
      { "members.userId": { $in: [user._id] } },
      { projection: { _id: 1 } },
    );
    const userTeamsIds = userTeams.map((t) => t._id);
    const haveAccessToBoard = await Board.countDocuments({
      _id: column.boardId,
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

    const $set = {
      description: args.description,
      statusId: args.statusId ? isomorphicObjectId(args.statusId) : undefined,
      columnId: args.columnId ? isomorphicObjectId(args.columnId) : undefined,
    };

    removeEmptyProperties($set);

    await Task.updateOne(
      {
        _id,
      },
      {
        $set,
      },
    );

    return {
      boardId: column.boardId,
    };
  },
  {
    mutationOptions: {
      async onSuccess(data, variables, _c, queryClient) {
        void taskListApi.invalidateQueries(queryClient, {
          boardId: data.boardId,
        });
        await taskGetApi.invalidateQueries(queryClient, variables);
      },
    },
  },
);

export default taskUpdateApi.handler;
