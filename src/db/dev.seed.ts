import getProject from "../collections/project";
import getTask, { TaskStatus } from "../collections/task";
import { userId } from "@italodeandra/auth/db/seed";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import dayjs from "dayjs";

const projectId = isomorphicObjectId("64040f191fba7928b4763f66");
const task1Id = isomorphicObjectId("64041c1b5cb96796f8e82595");
const task2Id = isomorphicObjectId("64041c2353c286fb13bc69c0");
const task3Id = isomorphicObjectId("64041c2cfc6cd1c1a0925311");

export async function seed() {
  const Project = getProject();
  const Task = getTask();
  if (process.env.APP_ENV === "development") {
    await Project.findOneAndUpdate(
      {
        _id: projectId,
      },
      {
        $set: {
          name: "Test",
          userId,
        },
      },
      {
        upsert: true,
      }
    );

    await Task.findOneAndUpdate(
      {
        _id: task1Id,
      },
      {
        $set: {
          title: "Test 1",
          projectId,
          userId,
          order: 0,
          updatedAt: dayjs().subtract(1, "day").toDate(),
          status: TaskStatus.DONE,
        },
      },
      {
        upsert: true,
      }
    );
    await Task.findOneAndUpdate(
      {
        _id: task2Id,
      },
      {
        $set: {
          title: "Test 2",
          status: TaskStatus.TODO,
          projectId,
          userId,
          order: 1,
        },
      },
      {
        upsert: true,
      }
    );
    await Task.findOneAndUpdate(
      {
        _id: task3Id,
      },
      {
        $set: {
          title: "Test 3",
          status: TaskStatus.DOING,
          projectId,
          userId,
          order: 0,
        },
      },
      {
        upsert: true,
      }
    );
  }
}
