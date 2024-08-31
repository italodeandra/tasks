import createApi from "@italodeandra/next/api/createApi";
import { unauthorized } from "@italodeandra/next/api/errors";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { connectDb } from "../../../db";
import getSubProject, { ISubProject } from "../../../collections/subProject";
import getTeam from "../../../collections/team";
import getProject, { IProject } from "../../../collections/project";
import getBoard from "../../../collections/board";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";

export const projectListWithSubProjectsApi = createApi(
  "/api/project/list-with-sub-projects",
  async (args: { boardId: string }, req, res) => {
    await connectDb();
    const Project = getProject();
    const SubProject = getSubProject();
    const Team = getTeam();
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
    const boardId = isomorphicObjectId(args.boardId);

    const haveAccessToReadBoard = await Board.countDocuments({
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
    if (!haveAccessToReadBoard) {
      throw unauthorized;
    }

    return Project.aggregate<
      Pick<IProject, "_id" | "name"> & {
        subProjects: Pick<ISubProject, "_id" | "name">[];
      }
    >([
      {
        $match: {
          boardId,
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
      },
      {
        $lookup: {
          from: SubProject.collection.collectionName,
          localField: "_id",
          foreignField: "projectId",
          as: "subProjects",
          pipeline: [
            {
              $match: {
                archived: { $ne: true },
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
            },
            {
              $sort: {
                updatedAt: -1,
              },
            },
            {
              $project: {
                name: 1,
              },
            },
          ],
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
      {
        $project: {
          name: 1,
          subProjects: 1,
        },
      },
    ]);
  },
  {
    queryKeyMap: (args) => [args?.boardId],
  },
);

export default projectListWithSubProjectsApi.handler;
