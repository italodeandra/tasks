import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { notFound, unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import createApi from "@italodeandra/next/api/createApi";
import getTeam from "../../../collections/team";
import { taskStatusListApi } from "./list";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import getTaskStatus, { ITaskStatus } from "../../../collections/taskStatus";
import getBoard from "../../../collections/board";
import getTask from "../../../collections/task";
import getTaskColumn from "../../../collections/taskColumn";

export const taskStatusDeleteApi = createApi(
  "/api/task-status/delete",
  async function (
    args: Jsonify<Pick<ITaskStatus, "_id">>,
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    await connectDb();
    const Team = getTeam();
    const TaskStatus = getTaskStatus();
    const Task = getTask();
    const Board = getBoard();
    const TaskColumn = getTaskColumn();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const _id = isomorphicObjectId(args._id);

    const status = await TaskStatus.findById(_id, {
      projection: {
        boardId: 1,
      },
    });

    if (!status) {
      throw notFound;
    }

    const userTeams = user
      ? await Team.find(
          { "members.userId": { $in: [user._id] } },
          { projection: { _id: 1 } },
        )
      : undefined;
    const userTeamsIds = userTeams?.map((t) => t._id);

    const haveAccessToBoard = await Board.countDocuments({
      _id: status.boardId,
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

    await Task.updateMany(
      {
        statusId: _id,
      },
      {
        $unset: {
          statusId: "",
        },
      },
    );

    await TaskColumn.updateMany(
      {
        linkedStatusId: _id,
      },
      {
        $unset: {
          linkedStatusId: "",
        },
      },
    );

    await TaskStatus.deleteOne({
      _id,
    });

    return {
      boardId: status.boardId,
    };
  },
  {
    mutationOptions: {
      async onSuccess(data, _v, _c, queryClient) {
        await taskStatusListApi.invalidateQueries(queryClient, data);
      },
    },
  },
);

export default taskStatusDeleteApi.handler;
