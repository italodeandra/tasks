import createApi from "@italodeandra/next/api/createApi";
import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { badRequest, unauthorized } from "@italodeandra/next/api/errors";
import getUser, { UserType } from "@italodeandra/auth/collections/user/User";
import emailRegExp from "@italodeandra/ui/utils/emailRegExp";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { boardGetApi } from "./get";
import getBoard from "../../../collections/board";
import { PermissionLevel } from "../../../collections/permission";
import { boardGetPermissionsApi } from "./get-permissions";

export const boardInviteUserApi = createApi(
  "/api/board/invite-user",
  async (args: { boardId: string; email: string }, req, res) => {
    await connectDb();
    const User = getUser();
    const Board = getBoard();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

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

    if (!emailRegExp.test(args.email)) {
      throw badRequest;
    }

    let userInvite = await User.findOne(
      {
        email: args.email,
      },
      {
        projection: {
          _id: 1,
        },
      },
    );
    if (!userInvite) {
      userInvite = await User.insertOne({
        email: args.email,
        type: UserType.NORMAL,
        password: "",
        passwordSalt: "",
      });
    }
    await Board.updateOne(
      {
        _id: boardId,
      },
      {
        $addToSet: {
          permissions: {
            userId: userInvite._id,
            level: PermissionLevel.READ,
          },
        },
      },
    );
  },
  {
    mutationOptions: {
      async onSuccess(_d, variables, _c, queryClient) {
        void boardGetApi.invalidateQueries(queryClient, {
          _id: variables.boardId,
        });
        await boardGetPermissionsApi.invalidateQueries(queryClient, {
          _id: variables.boardId,
        });
      },
    },
  },
);

export default boardInviteUserApi.handler;
