import createApi from "@italodeandra/next/api/createApi";
import { connectDb } from "../../../db";
import getTeam from "../../../collections/team";
import getBoard from "../../../collections/board";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import getUser from "@italodeandra/auth/collections/user/User";
import { filter, pick } from "lodash-es";

export const boardListAssigneesApi = createApi(
  "/api/board/list-assignees",
  async (
    args: {
      boardId: string;
    },
    req,
    res,
  ) => {
    await connectDb();
    const Team = getTeam();
    const Board = getBoard();
    const User = getUser();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const boardId = isomorphicObjectId(args.boardId);

    const userTeams = await Team.find(
      { "members.userId": { $in: [user._id] } },
      { projection: { _id: 1 } },
    );
    const userTeamsIds = userTeams.map((t) => t._id);
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

    const board = await Board.findById(boardId, {
      projection: {
        permissions: 1,
      },
    });

    const teamsIdsWithAccessToBoard =
      board?.permissions
        ?.map((permission) => permission.teamId!)
        .filter(Boolean) || [];
    const usersIdsWithAccessToBoard =
      board?.permissions
        ?.map((permission) => permission.userId!)
        .filter(Boolean) || [];

    const teams = await Team.find(
      {
        _id: {
          $in: teamsIdsWithAccessToBoard,
        },
      },
      {
        projection: {
          members: 1,
        },
      },
    );
    const teamsMembersIds = teams.flatMap((team) =>
      team.members.map((m) => m.userId),
    );

    const eligibleUsersIds = filter(
      [...usersIdsWithAccessToBoard, ...teamsMembersIds],
      (u) => !u.equals(user._id),
    );

    return [
      {
        ...pick(user, ["_id", "name", "email", "profilePicture"]),
        isMe: true,
      },
      ...(await User.find(
        {
          _id: { $in: eligibleUsersIds },
        },
        {
          projection: {
            name: 1,
            email: 1,
            profilePicture: 1,
          },
        },
      )),
    ];
  },
  {
    queryKeyMap: (args) => [args?.boardId],
  },
);

export default boardListAssigneesApi.handler;
