import createApi from "@italodeandra/next/api/createApi";
import { connectDb } from "../../../db";
import getTaskColumn from "../../../collections/taskColumn";
import getTeam from "../../../collections/team";
import getBoard from "../../../collections/board";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { notFound, unauthorized } from "@italodeandra/next/api/errors";
import getTaskActivity, {
  ActivityType,
} from "../../../collections/taskActivity";
import getTask from "../../../collections/task";
import { taskActivityListApi } from "./list";

export const taskActivityCommentApi = createApi(
  "/api/task-activity/comment",
  async (args: { taskId: string; content: string }, req, res) => {
    await connectDb();
    const TaskActivity = getTaskActivity();
    const Team = getTeam();
    const Board = getBoard();
    const Task = getTask();
    const TaskColumn = getTaskColumn();
    const user = await getUserFromCookies(req, res);
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

    await TaskActivity.insertOne({
      taskId,
      type: ActivityType.COMMENT,
      userId: user._id,
      data: {
        content: args.content,
      },
    });
  },
  {
    mutationOptions: {
      async onSuccess(_d, variables, _c, queryClient) {
        void taskActivityListApi.invalidateQueries(queryClient, variables);
      },
    },
  },
);

export default taskActivityCommentApi.handler;
