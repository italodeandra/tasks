import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import createApi from "@italodeandra/next/api/createApi";
import getTeam from "../../../collections/team";
import { taskStatusListApi } from "./list";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import getBoard from "../../../collections/board";
import getTaskStatus, { ITaskStatus } from "../../../collections/taskStatus";

export const taskStatusCreateApi = createApi(
  "/api/task-status/create",
  async function (
    args: Jsonify<Pick<ITaskStatus, "title" | "boardId">>,
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    await connectDb();
    const TaskStatus = getTaskStatus();
    const Team = getTeam();
    const Board = getBoard();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const userTeams = user
      ? await Team.find(
          { "members.userId": { $in: [user._id] } },
          { projection: { _id: 1 } },
        )
      : undefined;
    const userTeamsIds = userTeams?.map((t) => t._id);
    const boardId = isomorphicObjectId(args.boardId);

    const haveAccessToBoard = await Board.countDocuments({
      _id: boardId,
      $or: [
        ...(user
          ? [
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
            ]
          : []),
        {
          "permissions.public": true,
        },
      ],
    });

    if (!haveAccessToBoard) {
      throw unauthorized;
    }

    await TaskStatus.insertOne({
      title: args.title,
      boardId,
    });
  },
  {
    mutationOptions: {
      async onSuccess(_d, variables, _c, queryClient) {
        await taskStatusListApi.invalidateQueries(queryClient, variables);
      },
    },
  },
);

export default taskStatusCreateApi.handler;
