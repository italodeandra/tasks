import createApi from "@italodeandra/next/api/createApi";
import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { badRequest, unauthorized } from "@italodeandra/next/api/errors";
import getUser, { UserType } from "@italodeandra/auth/collections/user/User";
import emailRegExp from "@italodeandra/ui/utils/emailRegExp";
import getTeam, { MemberRole } from "../../../collections/team";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { teamListApi } from "./list";
import { teamGetApi } from "./get";

export const teamInviteUserApi = createApi(
  "/api/team/invite-user",
  async (args: { teamId: string; email: string }, req, res) => {
    await connectDb();
    const User = getUser();
    const Team = getTeam();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const teamId = isomorphicObjectId(args.teamId);

    const canEditTeam = await Team.countDocuments({
      _id: teamId,
      "members.role": MemberRole.ADMIN,
      "members.userId": {
        $in: [user._id],
      },
    });

    if (!canEditTeam) {
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
    await Team.updateOne(
      {
        _id: teamId,
      },
      {
        $addToSet: {
          members: {
            userId: userInvite._id,
            role: MemberRole.MEMBER,
          },
        },
      },
    );
  },
  {
    mutationOptions: {
      onSuccess(_d, variables, _c, queryClient) {
        void teamListApi.invalidateQueries(queryClient);
        void teamGetApi.invalidateQueries(queryClient, {
          _id: variables.teamId,
        });
      },
    },
  },
);

export default teamInviteUserApi.handler;
