import createApi from "@italodeandra/next/api/createApi";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import { connectDb } from "../../../db";
import getBoard from "../../../collections/board";
import getTeam from "../../../collections/team";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { boardListApi } from "./list";
import { boardGetApi } from "./get";

export const boardUpdateApi = createApi(
  "/api/board/update",
  async (args: { _id: string; name: string }, req, res) => {
    await connectDb();
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
    await Board.updateOne(
      {
        _id: isomorphicObjectId(args._id),
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
      },
      {
        $set: {
          name: args.name,
        },
      },
    );
  },
  {
    mutationOptions: {
      onSuccess(_d, variables, _c, queryClient) {
        void boardListApi.invalidateQueries(queryClient);
        const previousGetData = boardGetApi.getQueryData(queryClient, {
          _id: variables._id,
        });
        if (previousGetData) {
          void boardGetApi.setQueryData(
            queryClient,
            {
              ...previousGetData,
              name: variables.name,
            },
            { _id: variables._id },
          );
        }
      },
    },
  },
);

export default boardUpdateApi.handler;
