import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import createApi from "@italodeandra/next/api/createApi";
import getSubProject, { ISubProject } from "../../../collections/subProject";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { projectListWithSubProjectsApi } from "../project/list-with-sub-projects";
import getProject from "../../../collections/project";
import { PermissionLevel } from "../../../collections/permission";
import getBoard from "../../../collections/board";
import getTeam from "../../../collections/team";

export const subProjectCreateApi = createApi(
  "/api/sub-project/create",
  async function (
    args: Jsonify<Pick<ISubProject, "name" | "projectId">>,
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    await connectDb();
    const SubProject = getSubProject();
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

    const projectId = isomorphicObjectId(args.projectId);

    const boardId = (
      await Project.findOne(
        {
          _id: projectId,
          $or: [
            {
              permissions: {
                $exists: false,
              },
            },
            {
              "permissions.level": {
                $in: [PermissionLevel.ADMIN],
              },
              "permissions.userId": {
                $in: [user._id],
              },
            },
            {
              "permissions.level": {
                $in: [PermissionLevel.ADMIN],
              },
              "permissions.teamId": {
                $in: userTeamsIds,
              },
            },
          ],
        },
        { projection: { boardId: 1 } },
      )
    )?.boardId;

    const haveAccessToAdminProject =
      boardId &&
      (await Board.countDocuments({
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
      }));
    if (!haveAccessToAdminProject) {
      throw unauthorized;
    }

    await SubProject.insertOne({
      name: args.name,
      projectId,
    });

    await Project.updateOne(
      {
        _id: projectId,
      },
      {
        $set: {},
      },
    );

    return {
      boardId,
    };
  },
  {
    mutationOptions: {
      onSuccess(data, _v, _c, queryClient) {
        void projectListWithSubProjectsApi.invalidateQueries(queryClient, data);
      },
    },
  },
);

export default subProjectCreateApi.handler;
