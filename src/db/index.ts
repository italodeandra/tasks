import Project, { ProjectColor } from "../collections/project";
import Task, { TaskStatus } from "../collections/task";
import authMigration from "@italodeandra/auth/db/migration";
import authSeed, { userId } from "@italodeandra/auth/db/seed";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { connectDb as connect } from "@italodeandra/next/db";

let projectId = isomorphicObjectId("64040f191fba7928b4763f66");
let task1Id = isomorphicObjectId("64041c1b5cb96796f8e82595");
let task2Id = isomorphicObjectId("64041c2353c286fb13bc69c0");
let task3Id = isomorphicObjectId("64041c2cfc6cd1c1a0925311");

export async function connectDb() {
  await connect([
    authMigration,
    authSeed,
    async () => {
      await Project.findOneAndUpdate(
        {
          _id: projectId,
        },
        {
          $set: {
            name: "Test",
            color: ProjectColor.BLUE,
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
            content: "Test 1",
            status: TaskStatus.TODO,
            projectId,
            userId,
            order: 0,
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
            content: "Test 2",
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
            content: "Test 3",
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
    },
  ]);
}
