import createApi from "@italodeandra/next/api/createApi";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { notFound, unauthorized } from "@italodeandra/next/api/errors";
import { connectDb } from "../../../db";
import getTeam from "../../../collections/team";
import getBoard from "../../../collections/board";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { PermissionLevel } from "../../../collections/permission";
import getTimesheet, { TimesheetType } from "../../../collections/timesheet";
import { timesheetListApi } from "./list";
import getProject from "../../../collections/project";

export const timesheetAddExpenseApi = createApi(
  "/api/timesheet/add-expense",
  async (
    args: {
      projectsIds: string[];
      description: string;
      time: number;
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

    const projectsIds = args.projectsIds.map(isomorphicObjectId);

    const projects = await Project.find(
      {
        _id: { $in: projectsIds },
      },
      {
        projection: {
          boardId: 1,
        },
      },
    );
    if (!projects.length) {
      throw notFound;
    }

    const userTeams = await Team.find(
      { "members.userId": { $in: [user._id] } },
      { projection: { _id: 1 } },
    );
    const userTeamsIds = userTeams.map((t) => t._id);
    const haveAdminAccessToBoard = await Board.countDocuments({
      _id: {
        $in: projects.map((p) => p.boardId),
      },
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

    const timeFraction = args.time / projects.length;

    for (const project of projects) {
      await Timesheet.insertOne({
        type: TimesheetType.EXPENSE,
        boardId: project.boardId,
        projectId: project._id,
        time: timeFraction,
        description: args.description,
      });
    }

    return {
      boardId: projects[0].boardId,
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

export default timesheetAddExpenseApi.handler;
