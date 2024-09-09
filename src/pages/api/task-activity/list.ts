import createApi from "@italodeandra/next/api/createApi";
import { connectDb } from "../../../db";
import getTaskColumn from "../../../collections/taskColumn";
import getTeam from "../../../collections/team";
import getBoard from "../../../collections/board";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { notFound, unauthorized } from "@italodeandra/next/api/errors";
import asyncMap from "@italodeandra/next/utils/asyncMap";
import getTaskActivity from "../../../collections/taskActivity";
import getTask from "../../../collections/task";
import getUser from "@italodeandra/auth/collections/user/User";

export const taskActivityListApi = createApi(
  "/api/task-activity/list",
  async (args: { taskId: string }, req, res) => {
    await connectDb();
    const TaskActivity = getTaskActivity();
    const Team = getTeam();
    const Board = getBoard();
    const Task = getTask();
    const TaskColumn = getTaskColumn();
    const User = getUser();
    const user = await getUserFromCookies(req, res);

    const taskId = isomorphicObjectId(args.taskId);

    const task = await Task.findById(taskId, {
      projection: {
        columnId: 1,
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

    const tasks = await TaskActivity.find(
      {
        taskId,
      },
      {
        projection: {
          createdAt: 1,
          data: 1,
          userId: 1,
          type: 1,
        },
        sort: {
          createdAt: -1,
        },
      },
    );

    return asyncMap(tasks, async ({ userId, ...taskActivity }) => ({
      ...taskActivity,
      user: {
        ...(await User.findById(userId, {
          projection: {
            name: 1,
            email: 1,
            profilePicture: 1,
          },
        }))!,
        isMe: !!user && userId.equals(user._id),
      },
    }));
  },
  {
    queryKeyMap: (args) => [args?.taskId],
  },
);

export default taskActivityListApi.handler;

export type TaskActivityListApi = typeof taskActivityListApi.Types;
