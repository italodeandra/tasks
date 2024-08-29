import createApi from "@italodeandra/next/api/createApi";
import { unauthorized } from "@italodeandra/next/api/errors";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { connectDb } from "../../../db";
import getProject, { IProject } from "../../../collections/project";
import getTeam from "../../../collections/team";
import getClient, { IClient } from "../../../collections/client";

export const clientListWithProjectsApi = createApi(
  "/api/client/list-with-projects",
  async (_args: void, req, res) => {
    await connectDb();
    const Client = getClient();
    const Project = getProject();
    const Team = getTeam();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const teams = (
      await Team.find(
        {
          members: {
            $in: [user._id],
          },
        },
        {
          projection: {
            _id: 1,
          },
        },
      )
    ).map((t) => t._id);

    return Client.aggregate<
      Pick<IClient, "_id" | "name" | "updatedAt"> & {
        projects: Pick<IProject, "_id" | "name" | "updatedAt">[];
      }
    >([
      {
        $match: {
          $or: [
            {
              "participants.usersIds": {
                $in: [user._id],
              },
            },
            {
              "participants.teamsIds": {
                $in: teams,
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
                updatedAt: 1,
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
          updatedAt: 1,
        },
      },
    ]);
  },
);

export default clientListWithProjectsApi.handler;
