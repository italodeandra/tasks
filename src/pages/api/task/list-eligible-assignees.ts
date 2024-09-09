import createApi from "@italodeandra/next/api/createApi";
import { connectDb } from "../../../db";
import getTask from "../../../collections/task";
import getTaskColumn from "../../../collections/taskColumn";
import getTeam from "../../../collections/team";
import getBoard from "../../../collections/board";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { notFound, unauthorized } from "@italodeandra/next/api/errors";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import getUser from "@italodeandra/auth/collections/user/User";
import { filter, pick } from "lodash-es";

export const taskListEligibleAssigneesApi = createApi(
  "/api/task/list-eligible-assignees",
  async (
    args: {
      taskId: string;
    },
    req,
    res,
  ) => {
    await connectDb();
    const Task = getTask();
    const TaskColumn = getTaskColumn();
    const Team = getTeam();
    const Board = getBoard();
    const User = getUser();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const _id = isomorphicObjectId(args.taskId);

    const task = await Task.findById(_id, {
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

    const board = await Board.findById(column.boardId, {
      projection: {
        permissions: 1,
      },
    });

    const teamsIdsWithAccessToBoard =
      board?.permissions
        ?.map((permission) => permission.teamId!)
        .filter(Boolean) || [];
    const usersIdsWithAccessToBoard =
      board?.permissions
        ?.map((permission) => permission.userId!)
        .filter(Boolean) || [];

    const teams = await Team.find(
      {
        _id: {
          $in: teamsIdsWithAccessToBoard,
        },
      },
      {
        projection: {
          members: 1,
        },
      },
    );
    const teamsMembersIds = teams.flatMap((team) =>
      team.members.map((m) => m.userId),
    );

    const eligibleUsersIds = filter(
      [...usersIdsWithAccessToBoard, ...teamsMembersIds],
      (u) => !u.equals(user._id),
    );

    return [
      {
        ...pick(user, ["_id", "name", "email", "profilePicture"]),
        isMe: true,
      },
      ...(await User.find(
        {
          _id: { $in: eligibleUsersIds },
        },
        {
          projection: {
            name: 1,
            email: 1,
            profilePicture: 1,
          },
        },
      )),
    ];
  },
  {
    queryKeyMap: (args) => [args?.taskId],
  },
);

export default taskListEligibleAssigneesApi.handler;

export type TaskListEligibleAssigneesApi =
  typeof taskListEligibleAssigneesApi.Types;
