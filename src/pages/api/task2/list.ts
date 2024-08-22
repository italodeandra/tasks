import createApi from "@italodeandra/next/api/createApi";
import { unauthorized } from "@italodeandra/next/api/errors";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import getTask, { ITask } from "../../../collections/task2";
import { connectDb } from "../../../db";
import getProject, { IProject } from "../../../collections/project2";
import getTaskStatus, { ITaskStatus } from "../../../collections/taskStatus";
import { groupBy, toPairs } from "lodash-es";

export const taskListApi = createApi(
  "/api/task2/list",
  async (_args: void, req, res) => {
    await connectDb();
    const Task = getTask();
    const Project = getProject();
    const TaskStatus = getTaskStatus();
    const user = await getUserFromCookies(req, res);
    if (!user) {
      throw unauthorized;
    }

    const tasks = await Task.aggregate<
      ITask & {
        status: Pick<ITaskStatus, "_id" | "title">;
        project?: Pick<IProject, "_id" | "name">;
      }
    >([
      {
        $lookup: {
          from: TaskStatus.collection.collectionName,
          localField: "statusId",
          foreignField: "_id",
          as: "status",
        },
      },
      {
        $unwind: "$status",
      },
      {
        $lookup: {
          from: Project.collection.collectionName,
          localField: "projectId",
          foreignField: "_id",
          as: "project",
        },
      },
      {
        $unwind: {
          path: "$project",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          "project.participants": {
            $in: [user._id],
          },
        },
      },
      {
        $project: {
          title: 1,
          "status.title": 1,
          "project.name": 1,
        },
      },
    ]);

    return toPairs(groupBy(tasks, "status._id")).map(([statusId, tasks]) => ({
      _id: statusId,
      title: tasks[0].status.title,
      tasks,
    }));
  },
);

export default taskListApi.handler;

export type TaskListApi = typeof taskListApi.Types;
