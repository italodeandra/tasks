import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { NextApiRequest, NextApiResponse } from "next";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import createApi from "@italodeandra/next/api/createApi";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { boardGetApi } from "./get";
import getBoard, { IBoard } from "../../../collections/board";
import { boardGetPermissionsApi } from "./get-permissions";

export const boardLeaveApi = createApi(
  "/api/board/leave",
  async function (
    args: Jsonify<Pick<IBoard, "_id">>,
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    await connectDb();
    const Board = getBoard();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const _id = isomorphicObjectId(args._id);

    await Board.updateOne(
      {
        _id,
      },
      {
        $pull: {
          permissions: { userId: user._id },
        },
      },
    );
  },
  {
    mutationOptions: {
      onSuccess(_d, variables, _c, queryClient) {
        void boardGetApi.invalidateQueries(queryClient, variables);
        void boardGetPermissionsApi.invalidateQueries(queryClient, variables);
      },
    },
  },
);

export default boardLeaveApi.handler;
