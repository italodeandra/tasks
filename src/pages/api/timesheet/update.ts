import createApi from "@italodeandra/next/api/createApi";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { notFound, unauthorized } from "@italodeandra/next/api/errors";
import { connectDb } from "../../../db";
import getTeam from "../../../collections/team";
import getBoard from "../../../collections/board";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { PermissionLevel } from "../../../collections/permission";
import getTimesheet from "../../../collections/timesheet";
import { timesheetListApi } from "./list";
import { timesheetGetApi } from "./get";
import removeEmptyProperties from "@italodeandra/next/utils/removeEmptyProperties";

export const timesheetUpdateApi = createApi(
  "/api/timesheet/update",
  async (
    args: {
      _id: string;
      description?: string;
      time?: number;
    },
    req,
    res,
  ) => {
    await connectDb();
    const user = await getUserFromCookies(req, res);
    const Team = getTeam();
    const Board = getBoard();
    const Timesheet = getTimesheet();
    if (!user) {
      throw unauthorized;
    }

    const _id = isomorphicObjectId(args._id);

    const timesheet = await Timesheet.findById(_id, {
      projection: {
        boardId: 1,
      },
    });
    if (!timesheet) {
      throw notFound;
    }

    const userTeams = await Team.find(
      { "members.userId": { $in: [user._id] } },
      { projection: { _id: 1 } },
    );
    const userTeamsIds = userTeams.map((t) => t._id);
    const haveAdminAccessToBoard = await Board.countDocuments({
      _id: timesheet.boardId,
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

    const $set = {
      description: args.description,
      time: args.time,
    };
    removeEmptyProperties($set);

    await Timesheet.updateOne(
      {
        _id,
      },
      {
        $set,
      },
    );

    return {
      boardId: timesheet.boardId,
    };
  },
  {
    mutationOptions: {
      onSuccess(data, variables, _c, queryClient) {
        void timesheetGetApi.invalidateQueries(queryClient, variables);
        void timesheetListApi.invalidateQueries(queryClient, {
          boardId: data.boardId,
        });
      },
    },
  },
);

export default timesheetUpdateApi.handler;
