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
import getTimesheet, { TimesheetType } from "../../../collections/timesheet";
import { timesheetGetTaskOverviewApi } from "./get-task-overview";
import { timesheetGetMyOverviewApi } from "./get-my-overview";
import { taskListApi } from "../task/list";
import { boardState } from "../../../views/board/board.state";
import getTaskActivity, {
  ActivityType,
} from "../../../collections/taskActivity";
import { taskActivityListApi } from "../task-activity/list";

export const timesheetAddTaskApi = createApi(
  "/api/timesheet/add-task",
  async (args: { taskId: string; from: string; to: string }, req, res) => {
    await connectDb();
    const user = await getUserFromCookies(req, res);
    const Team = getTeam();
    const Board = getBoard();
    const Task = getTask();
    const TaskColumn = getTaskColumn();
    const Timesheet = getTimesheet();
    const TaskActivity = getTaskActivity();
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

    const startedAt = new Date(args.from);
    const stoppedAt = new Date(args.to);

    const time = stoppedAt.getTime() - startedAt.getTime();

    const timesheet = await Timesheet.insertOne({
      boardId: column.boardId,
      type: TimesheetType.TASK,
      taskId,
      startedAt,
      stoppedAt,
      time,
      userId: user._id,
    });

    await TaskActivity.insertOne({
      userId: user._id,
      taskId,
      type: ActivityType.TIMESHEET,
      data: {
        timesheetId: timesheet._id,
        time,
        retroactive: true,
      },
    });

    return {
      boardId: column.boardId,
    };
  },
  {
    mutationOptions: {
      onSuccess(data, variables, _c, queryClient) {
        void taskActivityListApi.invalidateQueries(queryClient, variables);
        void timesheetGetTaskOverviewApi.invalidateQueries(
          queryClient,
          variables,
        );
        void timesheetGetMyOverviewApi.invalidateQueries(queryClient);
        void taskListApi.invalidateQueries(queryClient, {
          boardId: data.boardId,
          selectedProjects: boardState.selectedProjects,
          selectedSubProjects: boardState.selectedSubProjects,
        });
      },
    },
  },
);

export default timesheetAddTaskApi.handler;
