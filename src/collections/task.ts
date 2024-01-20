import { schema, types } from "papr";
import { onlyServer } from "@italodeandra/next/utils/isServer";
import db from "@italodeandra/next/db";

export enum TaskStatus {
  TODO = "TODO",
  DOING = "DOING",
  BLOCKED = "BLOCKED",
  DONE = "DONE",
}

const taskSchema = onlyServer(() =>
  schema(
    {
      content: types.string(),
      title: types.string({ required: true }),
      description: types.string(),
      status: types.enum(Object.values(TaskStatus), { required: true }),
      projectId: types.objectId(),
      userId: types.objectId({ required: true }),
      order: types.number({ required: true }),
      tags: types.array(types.string({ required: true })),
    },
    {
      timestamps: true,
    }
  )
);

export type ITask = (typeof taskSchema)[0];

const getTask = () => onlyServer(() => db.model("tasks", taskSchema));

export default getTask;
