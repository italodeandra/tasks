import createApi from "@italodeandra/next/api/createApi";
import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { boardGetApi } from "./get";
import getBoard from "../../../collections/board";
import { PermissionLevel } from "../../../collections/permission";
import { boardGetPermissionsApi } from "./get-permissions";

export const boardInviteTeamApi = createApi(
  "/api/board/invite-team",
  async (args: { boardId: string; teamId: string }, req, res) => {
    await connectDb();
    const Board = getBoard();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const teamId = isomorphicObjectId(args.teamId);
    const boardId = isomorphicObjectId(args.boardId);

    const canEditBoard = await Board.countDocuments({
      _id: boardId,
      "permissions.level": PermissionLevel.ADMIN,
      "permissions.userId": {
        $in: [user._id],
      },
    });

    if (!canEditBoard) {
      throw unauthorized;
    }

    await Board.updateOne(
      {
        _id: boardId,
      },
      {
        $addToSet: {
          permissions: {
            teamId,
            level: PermissionLevel.READ,
          },
        },
      },
    );
  },
  {
    mutationOptions: {
      onSuccess(_d, variables, _c, queryClient) {
        void boardGetApi.invalidateQueries(queryClient, {
          _id: variables.boardId,
        });
        void boardGetPermissionsApi.invalidateQueries(queryClient, {
          _id: variables.boardId,
        });
      },
    },
  },
);

export default boardInviteTeamApi.handler;
