import createApi from "@italodeandra/next/api/createApi";
import { connectDb } from "../../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import {
  badRequest,
  notFound,
  unauthorized,
} from "@italodeandra/next/api/errors";
import getUser, { UserType } from "@italodeandra/auth/collections/user/User";
import emailRegExp from "@italodeandra/ui/utils/emailRegExp";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import getBoard from "../../../../collections/board";
import { PermissionLevel } from "../../../../collections/permission";
import { projectPermissionsListApi } from "./list";
import getTeam from "../../../../collections/team";
import getProject from "../../../../collections/project";
import { projectListWithSubProjectsApi } from "../list-with-sub-projects";

export const projectPermissionsInviteUserApi = createApi(
  "/api/project/permissions/invite-user",
  async (args: { projectId: string; email: string }, req, res) => {
    await connectDb();
    const User = getUser();
    const Board = getBoard();
    const Team = getTeam();
    const Project = getProject();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const userTeams = await Team.find(
      { "members.userId": { $in: [user._id] } },
      { projection: { _id: 1 } },
    );
    const userTeamsIds = userTeams.map((t) => t._id);

    const projectId = isomorphicObjectId(args.projectId);

    const project = await Project.findOne(
      {
        _id: projectId,
        $or: [
          {
            permissions: {
              $exists: false,
            },
          },
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
      },
      {
        projection: { boardId: 1 },
      },
    );
    if (!project) {
      throw notFound;
    }

    const hasAccessToBoard = await Board.countDocuments({
      _id: project.boardId,
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
    if (!hasAccessToBoard) {
      throw notFound;
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
    await Project.updateOne(
      {
        _id: projectId,
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

    return {
      boardId: project.boardId,
    };
  },
  {
    mutationOptions: {
      async onSuccess(data, variables, _c, queryClient) {
        void projectListWithSubProjectsApi.invalidateQueries(queryClient, data);
        await projectPermissionsListApi.invalidateQueries(
          queryClient,
          variables,
        );
      },
    },
  },
);

export default projectPermissionsInviteUserApi.handler;
