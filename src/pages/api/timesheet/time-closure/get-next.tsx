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
import getProject from "../../../../collections/project";
import getTask from "../../../../collections/task";
import filterBoolean from "@italodeandra/ui/utils/filterBoolean";
import getUser from "@italodeandra/auth/collections/user/User";
import dayjs from "dayjs";

export const timesheetTimeClosureGetNextApi = createApi(
  "/api/timesheet/time-closure/get-next",
  async (
    args: {
      projectId: string;
      usersTimeMultipliers?: string;
    },
    req,
    res,
  ) => {
    await connectDb();
    const user = await getUserFromCookies(req, res);
    const Team = getTeam();
    const Board = getBoard();
    const Timesheet = getTimesheet();
    const Project = getProject();
    const Task = getTask();
    const User = getUser();
    if (!user) {
      throw unauthorized;
    }

    const projectId = isomorphicObjectId(args.projectId);
    const usersTimeMultipliers = JSON.parse(
      args.usersTimeMultipliers || "[]",
    ) as { _id: string; multiplier: number; overheadRate: number }[];

    const project = await Project.findById(projectId, {
      projection: {
        boardId: 1,
      },
    });
    if (!project) {
      throw notFound;
    }

    const userTeams = await Team.find(
      { "members.userId": { $in: [user._id] } },
      { projection: { _id: 1 } },
    );
    const userTeamsIds = userTeams.map((t) => t._id);
    const haveAdminAccessToBoard = await Board.countDocuments({
      _id: project.boardId,
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

    const lastClosure = await Timesheet.findOne(
      {
        boardId: project.boardId,
        projectId,
        type: TimesheetType.CLOSURE,
      },
      {
        projection: {
          createdAt: 1,
          hourlyRate: 1,
          usersMultipliers: 1,
        },
        sort: {
          createdAt: -1,
        },
      },
    );

    const timesheets = await Timesheet.aggregate<
      Pick<ITimesheet, "_id" | "userId" | "time" | "type"> & {
        projectPortion: number;
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
          sortDate: { $ifNull: ["$stoppedAt", "$createdAt"] },
        },
      },
      {
        $match: {
          boardId: project.boardId,
          type: { $ne: TimesheetType.CLOSURE },
          $or: [
            {
              projectId,
            },
            {
              primaryProjectId: projectId,
            },
          ],
          ...(lastClosure?.createdAt
            ? {
                sortDate: {
                  $gte: dayjs(lastClosure.createdAt).toDate(),
                },
              }
            : {}),
        },
      },
      {
        $group: {
          _id: "$_id",
          userId: { $first: "$userId" },
          time: { $first: "$time" },
          type: { $first: "$type" },
          projectPortion: { $first: "$projectPortion" },
          task: { $first: "$task" },
        },
      },
      {
        $project: {
          userId: 1,
          time: 1,
          type: 1,
          projectPortion: 1,
          taskTitle: "$task.title",
        },
      },
    ]);

    const usersIds = filterBoolean(timesheets.map((t) => t.userId));
    const users = await User.find(
      {
        _id: {
          $in: usersIds,
        },
      },
      {
        projection: {
          name: 1,
          email: 1,
          profilePicture: 1,
        },
      },
    );

    const totalTime = timesheets.reduce((acc, t) => {
      const userMultiplier = usersTimeMultipliers?.find(
        (u) => u._id === t.userId?.toString(),
      );
      return (
        acc +
        t.projectPortion *
          (t.time
            ? t.type === TimesheetType.TASK
              ? t.time *
                (userMultiplier?.multiplier || 0) *
                (1 + (userMultiplier?.overheadRate || 0))
              : t.time
            : 0)
      );
    }, 0);

    return {
      users: users.map((user) => {
        const userLastClosure = lastClosure?.usersMultipliers?.find((u) =>
          u.userId.equals(user._id),
        );
        return {
          ...user,
          previousMultiplier: userLastClosure?.multiplier || 1,
          previousOverheadRate: userLastClosure?.overheadRate || 0,
        };
      }),
      totalTime,
      hourlyRate: lastClosure?.hourlyRate,
    };
  },
  {
    queryKeyMap: (args) => [args?.projectId, args?.usersTimeMultipliers],
  },
);

export default timesheetTimeClosureGetNextApi.handler;
