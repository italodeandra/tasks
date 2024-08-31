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
import { PaprUpdateFilter } from "papr/esm/mongodbTypes";
import { WritableDeep } from "type-fest";
import { boardState } from "../../../views/board/board.state";

export const taskUpdateApi = createApi(
  "/api/task/update",
  async (
    args: Jsonify<
      { _id: string } & Partial<
        Pick<
          ITask,
          "statusId" | "columnId" | "description" | "projectId" | "subProjectId"
        >
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

    const $set: WritableDeep<PaprUpdateFilter<ITask>["$set"]> = {
      description: args.description,
      statusId: args.statusId ? isomorphicObjectId(args.statusId) : undefined,
      columnId: args.columnId ? isomorphicObjectId(args.columnId) : undefined,
      projectId:
        args.projectId && args.projectId !== "__NONE__"
          ? isomorphicObjectId(args.projectId)
          : undefined,
      subProjectId:
        args.subProjectId && args.subProjectId !== "__NONE__"
          ? isomorphicObjectId(args.subProjectId)
          : undefined,
    };
    removeEmptyProperties($set);

    const $unset: WritableDeep<PaprUpdateFilter<ITask>["$unset"]> = {};
    if (args.projectId === "__NONE__") {
      $unset.projectId = "";
      $unset.subProjectId = "";
    }
    if (args.subProjectId === "__NONE__") {
      $unset.subProjectId = "";
    }

    await Task.updateOne(
      {
        _id,
      },
      {
        $set,
        $unset,
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
          selectedProjects: boardState.selectedProjects,
          selectedSubProjects: boardState.selectedSubProjects,
        });
        await taskGetApi.invalidateQueries(queryClient, variables);
      },
    },
  },
);

export default taskUpdateApi.handler;
