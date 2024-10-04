/* eslint-disable no-case-declarations */
import { omit } from "lodash-es";
import { Any, Column, Instruction, Task } from "./generateInstructions";

type BulkWriteOperation<Doc> = {
  insertOne?: { document: Doc };
  deleteOne?: { filter: { _id: string } };
  updateOne?: {
    filter: { _id: string };
    update: { $set: { [key: string]: Any } };
  };
};

export function generateMongoBulkWrites(instructions: Instruction[]): {
  columnOps: BulkWriteOperation<Column>[];
  taskOps: BulkWriteOperation<Task>[];
} {
  const columnOps: BulkWriteOperation<Column>[] = [];
  const taskOps: BulkWriteOperation<Task>[] = [];

  instructions.forEach((instruction) => {
    switch (instruction.type) {
      case "columnAdded":
        columnOps.push({
          insertOne: {
            document: {
              _id: instruction.columnId,
              ...omit(instruction, ["type", "columnId"]),
            },
          },
        });
        break;

      case "columnRemoved":
        columnOps.push({
          updateOne: {
            filter: { _id: instruction.columnId },
            update: {
              $set: {
                archived: true,
              },
            },
          },
        });
        break;

      case "columnUpdated":
        columnOps.push({
          updateOne: {
            filter: { _id: instruction.columnId },
            update: { $set: omit(instruction, ["type", "columnId"]) },
          },
        });
        break;

      case "taskAdded":
        taskOps.push({
          insertOne: {
            document: {
              _id: instruction.taskId,
              columnId: instruction.columnId,
              title: instruction.title,
            },
          },
        });
        break;

      case "taskRemoved":
        taskOps.push({
          deleteOne: {
            filter: { _id: instruction.taskId },
          },
        });
        break;

      case "taskUpdated":
        taskOps.push({
          updateOne: {
            filter: { _id: instruction.taskId },
            update: { $set: omit(instruction, ["type", "taskId"]) },
          },
        });
        break;
    }
  });

  return { columnOps, taskOps };
}
