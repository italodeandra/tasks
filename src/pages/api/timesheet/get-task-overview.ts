import createApi from "@italodeandra/next/api/createApi";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { notFound, unauthorized } from "@italodeandra/next/api/errors";
import { connectDb } from "../../../db";
import getTeam from "../../../collections/team";
import getBoard from "../../../collections/board";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import getTask from "../../../collections/task";
import getTaskColumn from "../../../collections/taskColumn";
import { PermissionLevel } from "../../../collections/permission";
import getTimesheet from "../../../collections/timesheet";
import { groupBy, sumBy, toPairs } from "lodash-es";
import asyncMap from "@italodeandra/next/utils/asyncMap";
import getUser from "@italodeandra/auth/collections/user/User";

export const timesheetGetTaskOverviewApi = createApi(
  "/api/timesheet/get-task-overview",
  async (args: { taskId: string }, req, res) => {
    await connectDb();
    const user = await getUserFromCookies(req, res);
    const Team = getTeam();
    const Board = getBoard();
    const Task = getTask();
    const TaskColumn = getTaskColumn();
    const Timesheet = getTimesheet();
    const User = getUser();
    if (!user) {
      throw unauthorized;
    }

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
        title: 1,
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
    const haveWriteAccessToBoard = await Board.countDocuments({
      _id: column.boardId,
      "permissions.level": {
        $in: [PermissionLevel.WRITE, PermissionLevel.ADMIN],
      },
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
    if (!haveWriteAccessToBoard) {
      throw notFound;
    }

    const timesheets = await Timesheet.find(
      {
        taskId,
      },
      {
        projection: {
          time: 1,
          userId: 1,
          startedAt: 1,
        },
      },
    );

    let users = await asyncMap(
      toPairs(groupBy(timesheets, "userId")),
      async ([userId, timesheets]) => {
        const user2 = (await User.findById(userId, {
          projection: {
            name: 1,
            email: 1,
          },
        }))!;
        const currentClockTimesheet = timesheets.find(
          (t) => t.time === undefined,
        );
        const isMe = user2._id.equals(user._id);
        return {
          user: {
            ...user2,
            isMe,
          },
          currentClock: currentClockTimesheet?.startedAt,
          timeClocked: sumBy(
            timesheets.filter((timesheet) => timesheet.time),
            "time",
          ),
        };
      },
    );

    const currentUserClock = users.find((u) => u.user.isMe)?.currentClock;

    users = users.sort((a, b) => (a.user.isMe ? -1 : b.user.isMe ? 1 : 0));

    return {
      users,
      currentUserClock,
    };
  },
  {
    queryKeyMap: (args) => [args?.taskId],
  },
);

export default timesheetGetTaskOverviewApi.handler;
