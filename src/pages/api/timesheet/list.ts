import createApi from "@italodeandra/next/api/createApi";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { notFound, unauthorized } from "@italodeandra/next/api/errors";
import { connectDb } from "../../../db";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import getTask, { ITask } from "../../../collections/task";
import getTimesheet, { ITimesheet } from "../../../collections/timesheet";
import getProject, { IProject } from "../../../collections/project";
import querify from "@italodeandra/next/utils/querify";
import getSubProject, { ISubProject } from "../../../collections/subProject";
import { PermissionLevel } from "../../../collections/permission";
import getBoard from "../../../collections/board";
import getTeam from "../../../collections/team";
import getUser, { IUser } from "@italodeandra/auth/collections/user/User";

export const timesheetListApi = createApi(
  "/api/timesheet/list",
  async (
    args: {
      boardId: string;
      from?: string;
      to?: string;
      projectsIds?: string[];
      subProjectsIds?: string[];
    },
    req,
    res,
  ) => {
    await connectDb();
    const user = await getUserFromCookies(req, res);
    const Task = getTask();
    const Timesheet = getTimesheet();
    const Project = getProject();
    const SubProject = getSubProject();
    const Board = getBoard();
    const Team = getTeam();
    const User = getUser();
    if (!user) {
      throw unauthorized;
    }

    const boardId = isomorphicObjectId(args.boardId);

    const userTeams = await Team.find(
      { "members.userId": { $in: [user._id] } },
      { projection: { _id: 1 } },
    );
    const userTeamsIds = userTeams.map((t) => t._id);
    const haveAdminAccessToBoard = await Board.countDocuments({
      _id: boardId,
      "permissions.level": {
        $in: [PermissionLevel.ADMIN],
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
    if (!haveAdminAccessToBoard) {
      throw notFound;
    }

    const queryArgs = querify(args);
    const from = queryArgs.from ? new Date(queryArgs.from) : undefined;
    const to = queryArgs.to ? new Date(queryArgs.to) : undefined;
    const projectsIds = queryArgs.projectsIds
      ?.split(",")
      .filter(Boolean)
      .map(isomorphicObjectId);
    const subProjectsIds = queryArgs.subProjectsIds
      ?.split(",")
      .filter(Boolean)
      .map(isomorphicObjectId);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};
    if (from) {
      filter["createdAt"] = {
        $gte: from,
      };
    }
    if (to) {
      filter["createdAt"] = {
        ...filter["createdAt"],
        $lte: to,
      };
    }
    if (projectsIds?.length) {
      filter["$or"] = [
        {
          "project._id": {
            $in: projectsIds,
          },
        },
        {
          "primaryProject._id": {
            $in: projectsIds,
          },
        },
      ];
    }
    if (subProjectsIds?.length) {
      filter["subProject._id"] = {
        $in: subProjectsIds,
      };
    }

    return Timesheet.aggregate<
      Pick<
        ITimesheet,
        "_id" | "type" | "description" | "createdAt" | "updatedAt" | "time"
      > & {
        task?: Pick<ITask, "_id" | "title" | "projectId" | "archived">;
        project?: Pick<IProject, "_id" | "name">;
        subProject?: Pick<ISubProject, "_id" | "name">;
        primaryProject?: Pick<IProject, "_id" | "name">;
        user?: Pick<IUser, "_id" | "name" | "email" | "profilePicture">;
      }
    >([
      {
        $match: {
          boardId,
          time: {
            $exists: true,
          },
        },
      },
      {
        $lookup: {
          from: Task.collection.collectionName,
          localField: "taskId",
          foreignField: "_id",
          as: "task",
          pipeline: [
            {
              $project: {
                title: 1,
                projectId: 1,
                subProjectId: 1,
                secondaryProjectsIds: 1,
                archived: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$task",
          preserveNullAndEmptyArrays: true,
        },
      },
      ...(projectsIds?.length === 1
        ? [
            {
              $unwind: {
                path: "$task.secondaryProjectsIds",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $addFields: {
                primaryProjectId: {
                  $cond: {
                    if: { $ifNull: ["$task.secondaryProjectsIds", false] },
                    then: "$task.projectId",
                    else: null,
                  },
                },
                projectId: {
                  $ifNull: ["$task.secondaryProjectsIds", "$projectId"],
                },
              },
            },
          ]
        : []),
      {
        $addFields: {
          description: {
            $ifNull: ["$description", "$task.title"],
          },
          projectId: {
            $ifNull: ["$projectId", "$task.projectId"],
          },
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
                name: 1,
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
          from: Project.collection.collectionName,
          localField: "primaryProjectId",
          foreignField: "_id",
          as: "primaryProject",
          pipeline: [
            {
              $project: {
                name: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$primaryProject",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: SubProject.collection.collectionName,
          localField: "task.subProjectId",
          foreignField: "_id",
          as: "subProject",
          pipeline: [
            {
              $project: {
                name: 1,
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
          from: User.collection.collectionName,
          localField: "userId",
          foreignField: "_id",
          as: "user",
          pipeline: [
            {
              $project: {
                name: 1,
                email: 1,
                profilePicture: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          sortDate: { $ifNull: ["$stoppedAt", "$createdAt"] },
        },
      },
      {
        $sort: {
          sortDate: 1,
        },
      },
      {
        $project: {
          type: 1,
          task: 1,
          description: 1,
          createdAt: 1,
          updatedAt: 1,
          time: 1,
          project: 1,
          subProject: 1,
          primaryProject: 1,
          user: 1,
        },
      },
      {
        $match: filter,
      },
      {
        // remove primaryProject if its id is the same as projectsIds[0]
        $addFields: {
          project: {
            $cond: {
              if: {
                $eq: ["$primaryProject._id", projectsIds?.[0]],
              },
              then: "$primaryProject",
              else: "$project",
            },
          },
          primaryProject: {
            $cond: {
              if: {
                $eq: ["$primaryProject._id", projectsIds?.[0]],
              },
              then: null,
              else: "$primaryProject",
            },
          },
        },
      },
    ]);
  },
  {
    queryKeyMap: (args) => [
      args?.boardId,
      args?.from,
      args?.to,
      args?.projectsIds,
      args?.subProjectsIds,
    ],
  },
);

export default timesheetListApi.handler;
