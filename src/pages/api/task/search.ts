import createApi from "@italodeandra/next/api/createApi";
import { connectDb } from "../../../db";
import getTask, { ITask } from "../../../collections/task";
import getTeam from "../../../collections/team";
import getBoard from "../../../collections/board";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import getProject from "../../../collections/project";
import getSubProject from "../../../collections/subProject";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { ObjectId } from "bson";
import getTaskColumn from "../../../collections/taskColumn";
import querify from "@italodeandra/next/utils/querify";

export const taskSearchApi = createApi(
  "/api/task/search",
  async (
    args: {
      query: string;
      exclude?: string[];
    },
    req,
    res,
  ) => {
    await connectDb();
    const Task = getTask();
    const Team = getTeam();
    const Board = getBoard();
    const Project = getProject();
    const SubProject = getSubProject();
    const TaskColumn = getTaskColumn();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const userTeams = user
      ? await Team.find(
          { "members.userId": { $in: [user._id] } },
          { projection: { _id: 1 } },
        )
      : undefined;
    const userTeamsIds = userTeams?.map((t) => t._id);

    const queryArgs = querify(args);
    const exclude = queryArgs.exclude?.split(",").map(isomorphicObjectId);

    return Task.aggregate<Pick<ITask, "_id" | "title">>([
      {
        $match: {
          _id: {
            $nin: exclude?.map(isomorphicObjectId) ?? [],
          },
          $or: [
            {
              title: {
                $regex: args.query,
                $options: "i",
              },
            },
            {
              _id: ObjectId.isValid(args.query)
                ? isomorphicObjectId(args.query)
                : null,
            },
          ],
          archived: { $ne: true },
        },
      },
      {
        $lookup: {
          from: Project.collection.collectionName,
          localField: "projectId",
          foreignField: "_id",
          as: "project",
          pipeline: [
            {
              $project: {
                archived: 1,
                permissions: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$project",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: SubProject.collection.collectionName,
          localField: "subProjectId",
          foreignField: "_id",
          as: "subProject",
          pipeline: [
            {
              $project: {
                archived: 1,
                permissions: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$subProject",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: TaskColumn.collection.collectionName,
          localField: "columnId",
          foreignField: "_id",
          as: "column",
          pipeline: [
            {
              $project: {
                boardId: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: "$column",
      },
      {
        $lookup: {
          from: Board.collection.collectionName,
          localField: "column.boardId",
          foreignField: "_id",
          as: "board",
          pipeline: [
            {
              $project: {
                permissions: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: "$board",
      },
      {
        $match: {
          "project.archived": { $ne: true },
          "subProject.archived": { $ne: true },
          $and: [
            {
              $or: [
                ...(user
                  ? [
                      {
                        "board.permissions.userId": {
                          $in: [user._id],
                        },
                      },
                      {
                        "board.permissions.teamId": {
                          $in: userTeamsIds,
                        },
                      },
                    ]
                  : []),
                {
                  "board.permissions.public": true,
                },
              ],
            },
            {
              $or: [
                {
                  "project.permissions": {
                    $exists: false,
                  },
                },
                ...(user
                  ? [
                      {
                        "project.permissions.userId": {
                          $in: [user._id],
                        },
                      },
                      {
                        "project.permissions.teamId": {
                          $in: userTeamsIds,
                        },
                      },
                    ]
                  : []),
                {
                  "project.permissions.public": true,
                },
              ],
            },
            {
              $or: [
                {
                  "subProject.permissions": {
                    $exists: false,
                  },
                },
                ...(user
                  ? [
                      {
                        "subProject.permissions.userId": {
                          $in: [user._id],
                        },
                      },
                      {
                        "subProject.permissions.teamId": {
                          $in: userTeamsIds,
                        },
                      },
                    ]
                  : []),
                {
                  "subProject.permissions.public": true,
                },
              ],
            },
          ],
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
      {
        $project: {
          title: 1,
        },
      },
      {
        $limit: 5,
      },
    ]);
  },
  {
    queryKeyMap: (args) => [args?.query, args?.exclude],
  },
);

export default taskSearchApi.handler;

export type TaskSearchApi = typeof taskSearchApi.Types;
