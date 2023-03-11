import { schema, types } from "papr";
import { onlyServer } from "@italodeandra/next/utils/isServer";
import db from "@italodeandra/next/db";

export enum TaskStatus {
  TODO = "TODO",
  DOING = "DOING",
  DONE = "DONE",
}

const taskSchema = onlyServer(() =>
  schema(
    {
      content: types.string({ required: true }),
      status: types.enum(Object.values(TaskStatus), { required: true }),
      projectId: types.objectId(),
      userId: types.objectId({ required: true }),
      order: types.number({ required: true }),
    },
    {
      timestamps: true,
    }
  )
);

export type ITask = (typeof taskSchema)[0];

const Task = onlyServer(() => db.model("tasks", taskSchema));

export default Task;
