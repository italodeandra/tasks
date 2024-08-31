import createApi from "@italodeandra/next/api/createApi";
import { unauthorized } from "@italodeandra/next/api/errors";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import getTask from "../../../collections/task";
import { connectDb } from "../../../db";
import getTaskColumn from "../../../collections/taskColumn";
import asyncMap from "@italodeandra/next/utils/asyncMap";
import getTeam from "../../../collections/team";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import getBoard from "../../../collections/board";
import querify from "@italodeandra/next/utils/querify";

export const taskListApi = createApi(
  "/api/task/list",
  async (
    args: {
      boardId: string;
      selectedProjects?: string[];
      selectedSubProjects?: string[];
    },
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
    const userTeams = await Team.find(
      { "members.userId": { $in: [user._id] } },
      { projection: { _id: 1 } },
    );
    const userTeamsIds = userTeams.map((t) => t._id);
    const boardId = isomorphicObjectId(args.boardId);

    const haveAccessToBoard = await Board.countDocuments({
      _id: boardId,
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

    const columns = await TaskColumn.find(
      {
        boardId,
        archived: { $ne: true },
      },
      {
        sort: {
          order: 1,
        },
        projection: {
          title: 1,
        },
      },
    );

    const queryArgs = querify(args);
    console.log("queryArgs.selectedProjects", queryArgs.selectedProjects);
    const isNoneSelected = queryArgs.selectedProjects
      ?.toString()
      ?.split(",")
      ?.some((p) => p === "__NONE__");
    const selectedProjects = queryArgs.selectedProjects
      ?.toString()
      ?.split(",")
      ?.filter((p) => p && p !== "__NONE__")
      ?.map(isomorphicObjectId);
    const selectedSubProjects = queryArgs.selectedSubProjects
      ?.toString()
      ?.split(",")
      ?.filter((p) => p && p !== "__NONE__")
      ?.map(isomorphicObjectId);

    return asyncMap(columns, async (c) => {
      const tasks = await Task.find(
        {
          archived: { $ne: true },
          columnId: c._id,
          $or:
            isNoneSelected ||
            selectedProjects?.length ||
            selectedSubProjects?.length
              ? [
                  ...(selectedProjects?.length || selectedSubProjects?.length
                    ? [
                        {
                          ...(selectedProjects?.length
                            ? {
                                projectId: {
                                  $in: selectedProjects,
                                },
                              }
                            : {}),
                          ...(selectedSubProjects?.length
                            ? {
                                subProjectId: {
                                  $in: selectedSubProjects,
                                },
                              }
                            : {}),
                        },
                      ]
                    : []),
                  ...(isNoneSelected
                    ? [
                        {
                          projectId: { $exists: false },
                        },
                      ]
                    : []),
                ]
              : undefined,
        },
        {
          projection: {
            title: 1,
          },
        },
      );

      return {
        ...c,
        tasks,
      } as typeof c & { tasks?: typeof tasks };
    });
  },
  {
    queryKeyMap: (args) => [
      args?.boardId,
      args?.selectedProjects,
      args?.selectedSubProjects,
    ],
  },
);

export default taskListApi.handler;
