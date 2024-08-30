import createApi from "@italodeandra/next/api/createApi";
import { unauthorized } from "@italodeandra/next/api/errors";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { connectDb } from "../../../db";
import getProject, { IProject } from "../../../collections/project";
import getTeam from "../../../collections/team";
import getClient, { IClient } from "../../../collections/client";
import getBoard from "../../../collections/board";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";

export const clientListWithProjectsApi = createApi(
  "/api/client/list-with-projects",
  async (args: { boardId: string }, req, res) => {
    await connectDb();
    const Client = getClient();
    const Project = getProject();
    const Team = getTeam();
    const Board = getBoard();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const userTeams = await Team.find(
      { members: { $in: [user._id] } },
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

    return Client.aggregate<
      Pick<IClient, "_id" | "name"> & {
        projects: Pick<IProject, "_id" | "name">[];
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
          from: Project.collection.collectionName,
          localField: "_id",
          foreignField: "clientId",
          as: "projects",
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
          projects: 1,
        },
      },
    ]);
  },
  {
    queryKeyMap: (args) => [args?.boardId],
  },
);

export default clientListWithProjectsApi.handler;
