import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import { connectDb } from "../../../db";
import createApi from "@italodeandra/next/api/createApi";
import getComment, { IComment } from "../../../collections/comment";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import Jsonify from "@italodeandra/next/utils/Jsonify";

export const commentListApi = createApi(
  "/api/comment/list",
  async (
    args: Jsonify<Pick<IComment, "taskId">>,
    req: NextApiRequest,
    res: NextApiResponse
  ) => {
    await connectDb();
    const Comment = getComment();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    return Comment.find(
      {
        taskId: isomorphicObjectId(args.taskId),
      },
      {
        projection: {
          content: 1,
          createdAt: 1,
        },
        sort: {
          createdAt: -1,
        },
      }
    );
  }
);

export default commentListApi.handler;
