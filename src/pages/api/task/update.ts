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
import getTaskActivity, {
  ActivityType,
} from "../../../collections/taskActivity";
import getTaskStatus from "../../../collections/taskStatus";
import { taskActivityListApi } from "../task-activity/list";
import getProject from "../../../collections/project";
import getSubProject from "../../../collections/subProject";
import getUser from "@italodeandra/auth/collections/user/User";

export const taskUpdateApi = createApi(
  "/api/task/update",
  async (
    args: Jsonify<
      { _id: string } & Partial<
        Pick<
          ITask,
          | "statusId"
          | "columnId"
          | "description"
          | "projectId"
          | "subProjectId"
          | "assignees"
          | "title"
          | "secondaryProjectsIds"
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
    const TaskActivity = getTaskActivity();
    const TaskStatus = getTaskStatus();
    const Project = getProject();
    const SubProject = getSubProject();
    const User = getUser();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const _id = isomorphicObjectId(args._id);

    const task = await Task.findById(_id, {
      projection: {
        columnId: 1,
        assignees: 1,
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

    const statusId = args.statusId
      ? isomorphicObjectId(args.statusId)
      : undefined;

    const $set: WritableDeep<PaprUpdateFilter<ITask>["$set"]> = {
      description: args.description,
      title: args.title,
      statusId,
      columnId: args.columnId ? isomorphicObjectId(args.columnId) : undefined,
      projectId:
        args.projectId && args.projectId !== "__NONE__"
          ? isomorphicObjectId(args.projectId)
          : undefined,
      subProjectId:
        args.subProjectId && args.subProjectId !== "__NONE__"
          ? isomorphicObjectId(args.subProjectId)
          : undefined,
      assignees: args.assignees?.map(isomorphicObjectId),
      secondaryProjectsIds: args.secondaryProjectsIds?.map(isomorphicObjectId),
    };
    removeEmptyProperties($set);

    const $unset: WritableDeep<PaprUpdateFilter<ITask>["$unset"]> = {};
    if (args.projectId === "__NONE__") {
      $unset.projectId = "";
      $unset.subProjectId = "";
      $unset.secondaryProjectsIds = "";
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

    void (async () => {
      if (args.columnId) {
        await TaskActivity.insertOne({
          type: ActivityType.MOVE,
          taskId: _id,
          data: {
            type: "column",
            title: column.title,
          },
          userId: user._id,
        });
      }
      if (statusId) {
        await TaskActivity.insertOne({
          type: ActivityType.MOVE,
          taskId: _id,
          data: {
            type: "status",
            title: (await TaskStatus.findById(statusId, {
              projection: {
                title: 1,
              },
            }))!.title,
          },
          userId: user._id,
        });
      }
      if (args.projectId) {
        await TaskActivity.insertOne({
          type: ActivityType.MOVE,
          taskId: _id,
          data: {
            type: "project",
            title:
              args.projectId !== "__NONE__"
                ? (await Project.findById(isomorphicObjectId(args.projectId), {
                    projection: {
                      name: 1,
                    },
                  }))!.name
                : "None",
          },
          userId: user._id,
        });
      }
      if (args.subProjectId) {
        await TaskActivity.insertOne({
          type: ActivityType.MOVE,
          taskId: _id,
          data: {
            type: "sub-project",
            title:
              args.subProjectId !== "__NONE__"
                ? (await SubProject.findById(
                    isomorphicObjectId(args.subProjectId),
                    {
                      projection: {
                        name: 1,
                      },
                    },
                  ))!.name
                : "None",
          },
          userId: user._id,
        });
      }
      if (args.assignees) {
        const before =
          task.assignees?.map((assignee) => assignee.toString()) || [];
        const after = args.assignees;
        const type = before.length > after.length ? "remove" : "add";
        const users =
          type === "remove"
            ? before.filter((u) => !after.includes(u))
            : after.filter((u) => !before.includes(u));

        await TaskActivity.insertOne({
          type: ActivityType.ASSIGN,
          taskId: _id,
          data: {
            type,
            users: (
              await User.find({
                _id: {
                  $in: users.map(isomorphicObjectId),
                },
              })
            ).map((u) => u.name || u.email),
          },
          userId: user._id,
        });
      }
      if (args.description) {
        await TaskActivity.insertOne({
          type: ActivityType.UPDATE,
          taskId: _id,
          data: {
            field: "description",
            description: args.description,
          },
          userId: user._id,
        });
      }
      if (args.title) {
        await TaskActivity.insertOne({
          type: ActivityType.CHANGE_TITLE,
          taskId: _id,
          data: {
            title: args.title,
          },
          userId: user._id,
        });
      }
    })();

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
        void taskActivityListApi.invalidateQueries(queryClient, {
          taskId: variables._id,
        });
        await taskGetApi.invalidateQueries(queryClient, variables);
      },
    },
  },
);

export default taskUpdateApi.handler;
