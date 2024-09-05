import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { notFound, unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import createApi from "@italodeandra/next/api/createApi";
import getTeam from "../../../collections/team";
import { taskStatusListApi } from "./list";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import removeEmptyProperties from "@italodeandra/next/utils/removeEmptyProperties";
import getTaskStatus, { ITaskStatus } from "../../../collections/taskStatus";
import getBoard from "../../../collections/board";

export const taskStatusUpdateApi = createApi(
  "/api/task-status/update",
  async function (
    args: Jsonify<
      Pick<ITaskStatus, "_id"> & Partial<Pick<ITaskStatus, "title">>
    >,
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    await connectDb();
    const Team = getTeam();
    const TaskStatus = getTaskStatus();
    const Board = getBoard();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const _id = isomorphicObjectId(args._id);

    const status = await TaskStatus.findById(_id, {
      projection: {
        boardId: 1,
      },
    });

    if (!status) {
      throw notFound;
    }

    const userTeams = user
      ? await Team.find(
          { "members.userId": { $in: [user._id] } },
          { projection: { _id: 1 } },
        )
      : undefined;
    const userTeamsIds = userTeams?.map((t) => t._id);

    const haveAccessToBoard = await Board.countDocuments({
      _id: status.boardId,
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

    const $set = {
      title: args.title,
    };

    removeEmptyProperties($set);

    await TaskStatus.updateOne(
      {
        _id,
      },
      {
        $set,
      },
    );

    return {
      boardId: status.boardId,
    };
  },
  {
    mutationOptions: {
      async onSuccess(data, _v, _c, queryClient) {
        await taskStatusListApi.invalidateQueries(queryClient, data);
      },
    },
  },
);

export default taskStatusUpdateApi.handler;
