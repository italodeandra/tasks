import { schema, types } from "papr";
import { onlyServer } from "@italodeandra/next/utils/isServer";
import db from "@italodeandra/next/db";

const taskSchema = onlyServer(() =>
  schema(
    {
      title: types.string({ required: true }),
      description: types.string(),
      statusId: types.objectId({ required: true }),
      projectId: types.objectId(),
      createdByUserId: types.objectId({ required: true }),
      order: types.number({ required: true }),
    },
    {
      timestamps: true,
    },
  ),
);

export type ITask = (typeof taskSchema)[0];

const getTask = () => onlyServer(() => db.model("tasks2", taskSchema));

export default getTask;
