import createApi from "@italodeandra/next/api/createApi";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { notFound, unauthorized } from "@italodeandra/next/api/errors";
import { PermissionLevel } from "../../../../collections/permission";
import { connectDb } from "../../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import getTeam from "../../../../collections/team";
import getBoard from "../../../../collections/board";
import getTimesheet, {
  ITimesheet,
  TimesheetType,
} from "../../../../collections/timesheet";
import getTask, { ITask } from "../../../../collections/task";
import dayjs from "dayjs";
import getProject from "../../../../collections/project";
import { groupBy, toPairs } from "lodash-es";
import getSubProject, { ISubProject } from "../../../../collections/subProject";
import getUser, { IUser } from "@italodeandra/auth/collections/user/User";

export const timesheetTimeClosureGetApi = createApi(
  "/api/timesheet/time-closure/get",
  async (
    args: {
      _id: string;
    },
    req,
    res,
  ) => {
    await connectDb();
    const user = await getUserFromCookies(req, res);
    const Team = getTeam();
    const Board = getBoard();
    const Timesheet = getTimesheet();
    const Task = getTask();
    const Project = getProject();
    const SubProject = getSubProject();
    const User = getUser();
    if (!user) {
      throw unauthorized;
    }

    const _id = isomorphicObjectId(args._id);

    const closure = await Timesheet.findById(_id, {
      projection: {
        boardId: 1,
        createdAt: 1,
        hourlyRate: 1,
        usersMultipliers: 1,
        projectId: 1,
        time: 1,
      },
    });
    if (!closure) {
      throw notFound;
    }

    const userTeams = await Team.find(
      { "members.userId": { $in: [user._id] } },
      { projection: { _id: 1 } },
    );
    const userTeamsIds = userTeams.map((t) => t._id);
    const haveAdminAccessToBoard = await Board.countDocuments({
      _id: closure.boardId,
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

    const previousClosure = await Timesheet.findOne(
      {
        boardId: closure.boardId,
        projectId: closure.projectId,
        type: TimesheetType.CLOSURE,
        createdAt: {
          $lt: closure.createdAt,
        },
      },
      {
        projection: {
          createdAt: 1,
        },
        sort: {
          createdAt: 1,
        },
      },
    );

    const timesheets = await Timesheet.aggregate<
      Pick<ITimesheet, "_id" | "userId" | "time" | "type" | "description"> & {
        projectPortion: number;
        task?: Pick<
          ITask,
          | "_id"
          | "title"
          | "projectId"
          | "subProjectId"
          | "secondaryProjectsIds"
        >;
        subProject?: Pick<ISubProject, "_id" | "name">;
        user?: Pick<IUser, "_id" | "name" | "email" | "profilePicture">;
      }
    >([
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
      {
        $addFields: {
          projectPortion: {
            $cond: {
              if: { $ifNull: ["$task.secondaryProjectsIds", false] },
              then: {
                $divide: [
                  1,
                  { $sum: [1, { $size: "$task.secondaryProjectsIds" }] },
                ],
              },
              else: 1,
            },
          },
        },
      },
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
      {
        $addFields: {
          projectId: {
            $ifNull: ["$projectId", "$task.projectId"],
          },
        },
      },
      {
        $match: {
          boardId: closure.boardId,
          type: { $ne: TimesheetType.CLOSURE },
          $or: [
            {
              projectId: closure.projectId,
            },
            {
              primaryProjectId: closure.projectId,
            },
          ],
          createdAt: {
            ...(previousClosure
              ? {
                  $gte: dayjs(previousClosure.createdAt).toDate(),
                }
              : {
                  $lte: closure.createdAt,
                }),
          },
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
        $project: {
          time: 1,
          type: 1,
          projectPortion: 1,
          task: 1,
          subProject: 1,
          description: 1,
          user: 1,
        },
      },
    ]);

    const taskTimesheets = timesheets.filter((timesheet) => timesheet.task);
    const nonTaskTimesheets = timesheets.filter((timesheet) => !timesheet.task);
    const groupTimesheetsByTaskId = groupBy(taskTimesheets, (timesheet) =>
      timesheet.task!._id.toString(),
    );
    const groupTimesheetsByUserId = groupBy(taskTimesheets, (timesheet) =>
      timesheet.user!._id.toString(),
    );

    return {
      closure: {
        hourlyRate: closure.hourlyRate!,
        project: (await Project.findById(closure.projectId!, {
          projection: {
            name: 1,
          },
        }))!,
        createdAt: closure.createdAt,
        totalTime: closure.time!,
      },
      timesheets: [
        ...toPairs(groupTimesheetsByTaskId).map(([taskId, timesheet]) => ({
          _id: taskId,
          description: timesheet[0].task!.title,
          project: timesheet[0].subProject?.name,
          time: timesheet.reduce((acc, t) => {
            const userMultiplier = closure.usersMultipliers?.find((u) =>
              u.userId.equals(t.user?._id),
            );
            return (
              acc +
              t.projectPortion *
                (t.time! *
                  (userMultiplier?.multiplier || 1) *
                  (1 + (userMultiplier?.overheadRate || 0)))
            );
          }, 0),
        })),
        ...nonTaskTimesheets.map((timesheet) => ({
          _id: timesheet._id,
          description: timesheet.description,
          time: timesheet.time!,
          project: null,
        })),
      ],
      users: toPairs(groupTimesheetsByUserId).map(([, timesheet]) => ({
        ...timesheet[0].user!,
        time: timesheet.reduce(
          (acc, t) =>
            acc +
            t.projectPortion *
              (t.time! *
                (closure.usersMultipliers?.find((u) =>
                  u.userId.equals(t.user?._id),
                )?.multiplier || NaN)),
          0,
        ),
      })),
    };
  },
  {
    queryKeyMap: (args) => [args?._id],
  },
);

export default timesheetTimeClosureGetApi.handler;
