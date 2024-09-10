import { connectDb } from "../../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { notFound, unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import createApi from "@italodeandra/next/api/createApi";
import getTeam from "../../../../collections/team";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { subProjectPermissionsListApi } from "./list";
import getBoard from "../../../../collections/board";
import getProject from "../../../../collections/project";
import getSubProject from "../../../../collections/subProject";
import { projectListWithSubProjectsApi } from "../../project/list-with-sub-projects";

export const subProjectPermissionsClearApi = createApi(
  "/api/sub-project/permissions/clear",
  async function (
    args: {
      subProjectId: string;
    },
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    await connectDb();
    const Team = getTeam();
    const Project = getProject();
    const SubProject = getSubProject();
    const Board = getBoard();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const userTeams = await Team.find(
      { "members.userId": { $in: [user._id] } },
      { projection: { _id: 1 } },
    );
    const userTeamsIds = userTeams.map((t) => t._id);

    const subProjectId = isomorphicObjectId(args.subProjectId);

    const subProject = await SubProject.findOne(
      {
        _id: subProjectId,
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
        projection: { projectId: 1 },
      },
    );
    if (!subProject) {
      throw notFound;
    }

    const project = await Project.findOne(
      {
        _id: subProject.projectId,
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

    await SubProject.updateOne(
      {
        _id: subProjectId,
      },
      {
        $unset: {
          permissions: "",
        },
      },
    );

    return {
      boardId: project.boardId,
    };
  },
  {
    mutationOptions: {
      onSuccess(data, variables, _c, queryClient) {
        void projectListWithSubProjectsApi.invalidateQueries(queryClient, data);
        void subProjectPermissionsListApi.invalidateQueries(
          queryClient,
          variables,
        );
      },
    },
  },
);

export default subProjectPermissionsClearApi.handler;
