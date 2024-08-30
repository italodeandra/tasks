import { schema, types } from "papr";
import { onlyServer } from "@italodeandra/next/utils/isServer";
import db from "@italodeandra/next/db";

const taskSchema = onlyServer(() =>
  schema(
    {
      title: types.string({ required: true }),
      description: types.string(),
      statusId: types.objectId(),
      columnId: types.objectId({ required: true }),
      projectId: types.objectId(),
      clientId: types.objectId(),
      order: types.number({ required: true }),
      archived: types.boolean(),
      assignees: types.array(types.objectId()),
      priority: types.number(),
    },
    {
      timestamps: true,
    },
  ),
);

export type ITask = (typeof taskSchema)[0];

const getTask = () => onlyServer(() => db.model("tasks", taskSchema));

export default getTask;
