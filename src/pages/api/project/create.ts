import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import createApi from "@italodeandra/next/api/createApi";
import getProject, { IProject } from "../../../collections/project";
import { projectListWithSubProjectsApi } from "./list-with-sub-projects";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import getBoard from "../../../collections/board";
import { PermissionLevel } from "../../../collections/permission";
import getTeam from "../../../collections/team";

export const projectCreateApi = createApi(
  "/api/project/create",
  async function (
    args: Jsonify<Pick<IProject, "name" | "boardId">>,
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    await connectDb();
    const Project = getProject();
    const Board = getBoard();
    const Team = getTeam();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const userTeams = await Team.find(
      { "members.userId": { $in: [user._id] } },
      { projection: { _id: 1 } },
    );
    const userTeamsIds = userTeams.map((t) => t._id);
    const boardId = isomorphicObjectId(args.boardId);

    const haveAccessToAdminBoard = await Board.countDocuments({
      _id: boardId,
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
    if (!haveAccessToAdminBoard) {
      throw unauthorized;
    }

    await Project.insertOne({
      name: args.name,
      boardId: isomorphicObjectId(args.boardId),
    });
  },
  {
    mutationOptions: {
      onSuccess(_d, variables, _c, queryClient) {
        void projectListWithSubProjectsApi.invalidateQueries(
          queryClient,
          variables,
        );
      },
    },
  },
);

export default projectCreateApi.handler;
