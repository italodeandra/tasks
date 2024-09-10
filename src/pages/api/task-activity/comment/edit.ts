import createApi from "@italodeandra/next/api/createApi";
import { connectDb } from "../../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { unauthorized } from "@italodeandra/next/api/errors";
import getTaskActivity, {
  ActivityType,
} from "../../../../collections/taskActivity";
import { taskActivityListApi } from "../list";

export const taskActivityCommentEditApi = createApi(
  "/api/task-activity/comment/edit",
  async (args: { _id: string; newContent: string }, req, res) => {
    await connectDb();
    const TaskActivity = getTaskActivity();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const _id = isomorphicObjectId(args._id);

    const taskActivity = await TaskActivity.findById(_id, {
      projection: {
        taskId: 1,
        userId: 1,
      },
    });
    if (!taskActivity?.userId?.equals(user._id)) {
      throw unauthorized;
    }

    if (args.newContent) {
      await TaskActivity.updateOne(
        {
          _id,
          type: ActivityType.COMMENT,
          userId: user._id,
        },
        {
          $set: {
            "data.content": args.newContent,
          },
        },
      );
    } else {
      await TaskActivity.deleteOne({
        _id,
        type: ActivityType.COMMENT,
        userId: user._id,
      });
    }

    return {
      taskId: taskActivity.taskId,
    };
  },
  {
    mutationOptions: {
      onSuccess(data, _v, _c, queryClient) {
        void taskActivityListApi.invalidateQueries(queryClient, data);
      },
    },
  },
);

export default taskActivityCommentEditApi.handler;
