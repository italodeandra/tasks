import createApi from "@italodeandra/next/api/createApi";
import { notFound, unauthorized } from "@italodeandra/next/api/errors";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import getTask from "../../../collections/task";
import { connectDb } from "../../../db";
import getTaskColumn from "../../../collections/taskColumn";
import getTeam from "../../../collections/team";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import getBoard from "../../../collections/board";
import asyncMap from "@italodeandra/next/utils/asyncMap";
import { omit } from "lodash-es";
import getUser from "@italodeandra/auth/collections/user/User";

export const taskGetApi = createApi(
  "/api/task/get",
  async (args: { _id: string }, req, res) => {
    await connectDb();
    const Task = getTask();
    const TaskColumn = getTaskColumn();
    const Team = getTeam();
    const Board = getBoard();
    const User = getUser();
    const user = await getUserFromCookies(req, res);

    const _id = isomorphicObjectId(args._id);

    const task = await Task.findById(_id, {
      projection: {
        title: 1,
        columnId: 1,
        description: 1,
        statusId: 1,
        projectId: 1,
        subProjectId: 1,
        assignees: 1,
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

    const userTeams = user
      ? await Team.find(
          { "members.userId": { $in: [user._id] } },
          { projection: { _id: 1 } },
        )
      : undefined;
    const userTeamsIds = userTeams?.map((t) => t._id);
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

    return {
      ...omit(task, "assignees"),
      assignees: await asyncMap(
        await User.find(
          {
            _id: {
              $in: task.assignees,
            },
          },
          {
            projection: {
              name: 1,
              email: 1,
            },
          },
        ),
        async (user2) => ({
          ...user2,
          isMe: !!user && user2._id.equals(user._id),
        }),
      ),
    };
  },
  {
    queryKeyMap: (args) => [args?._id],
  },
);

export default taskGetApi.handler;

export type TaskGetApi = typeof taskGetApi.Types;
