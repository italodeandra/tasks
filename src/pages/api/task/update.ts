import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import createApi from "@italodeandra/next/api/createApi";
import { unauthorized } from "@italodeandra/next/api/errors";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { NextApiRequest, NextApiResponse } from "next";
import { taskListApi } from "./list";
import { connectDb } from "../../../db";
import getTask, { ITask } from "../../../collections/task";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import { invalidate_projectList } from "../project/list";
import removeEmptyProperties from "@italodeandra/next/utils/removeEmptyProperties";
import type { StrictUpdateFilter } from "mongodb";
import { WritableDeep } from "type-fest";
import getProject from "../../../collections/project";
import { pick } from "lodash";

export const taskUpdateApi = createApi(
  "/api/task/update",
  async (
    args: Jsonify<
      Pick<
        Partial<ITask>,
        "title" | "description" | "projectId" | "status" | "order"
      > & {
        _id: string;
      }
    >,
    req: NextApiRequest,
    res: NextApiResponse
  ) => {
    await connectDb();
    let Task = getTask();
    let Project = getProject();
    let user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const _id = isomorphicObjectId(args._id);

    let $set = {
      ...pick(args, ["title", "description", "status", "order"]),
      projectId:
        args.projectId && args.projectId !== "NONE"
          ? isomorphicObjectId(args.projectId)
          : undefined,
    };
    let $unset: WritableDeep<StrictUpdateFilter<ITask>["$unset"]> = {};

    removeEmptyProperties($set);

    if (args.projectId === "NONE") {
      delete $set.projectId;
      $unset.projectId = "";
    }

    if ($set.projectId) {
      await Project.updateOne(
        { _id: $set.projectId },
        {
          $set: {
            updatedAt: new Date(),
          },
        }
      );
    }

    await Task.updateOne(
      {
        _id,
        userId: user._id,
      },
      {
        $set,
        $unset,
      }
    );
  },
  {
    mutationOptions: {
      onSuccess: (_data, _args, queryClient) => {
        void taskListApi.invalidate(queryClient);
        void invalidate_projectList(queryClient);
      },
    },
  }
);

export default taskUpdateApi.handler;
