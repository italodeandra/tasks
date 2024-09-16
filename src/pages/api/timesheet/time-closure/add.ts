import createApi from "@italodeandra/next/api/createApi";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { notFound, unauthorized } from "@italodeandra/next/api/errors";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { connectDb } from "../../../../db";
import getTeam from "../../../../collections/team";
import getBoard from "../../../../collections/board";
import getTimesheet, { TimesheetType } from "../../../../collections/timesheet";
import getProject from "../../../../collections/project";
import { PermissionLevel } from "../../../../collections/permission";
import { timesheetListApi } from "../list";

export const timesheetTimeClosureAddApi = createApi(
  "/api/timesheet/time-closure/add",
  async (
    args: {
      projectId: string;
      totalTime: number;
      hourlyRate: number;
      closureTime: number;
      usersMultipliers: {
        _id: string;
        multiplier: number;
        overheadRate: number;
      }[];
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
    if (!user) {
      throw unauthorized;
    }

    const projectId = isomorphicObjectId(args.projectId);

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

    const time = args.closureTime;
    const carryover = args.totalTime - time;

    const closure = await Timesheet.insertOne({
      type: TimesheetType.CLOSURE,
      boardId: project.boardId,
      projectId,
      time,
      hourlyRate: args.hourlyRate,
      usersMultipliers: args.usersMultipliers?.map((userMultiplier) => ({
        userId: isomorphicObjectId(userMultiplier._id),
        multiplier: userMultiplier.multiplier,
        overheadRate: userMultiplier.overheadRate,
      })),
    });
    if (carryover > 60000) {
      await Timesheet.insertOne({
        type: TimesheetType.CARRYOVER,
        boardId: project.boardId,
        projectId,
        time: carryover,
      });
    }

    return {
      _id: closure._id,
      boardId: project.boardId,
    };
  },
  {
    mutationOptions: {
      onSuccess(data, _v, _c, queryClient) {
        void timesheetListApi.invalidateQueries(queryClient, data);
      },
    },
  },
);

export default timesheetTimeClosureAddApi.handler;
