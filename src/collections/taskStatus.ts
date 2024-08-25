import { schema, types } from "papr";
import { onlyServer } from "@italodeandra/next/utils/isServer";
import db from "@italodeandra/next/db";

const taskStatusSchema = onlyServer(() =>
  schema(
    {
      title: types.string({ required: true }),
      createdByUserId: types.objectId({ required: true }),
      order: types.number({ required: true }),
      archived: types.boolean(),
    },
    {
      timestamps: true,
    },
  ),
);

export type ITaskStatus = (typeof taskStatusSchema)[0];

const getTaskStatus = () =>
  onlyServer(() => db.model("taskStatus", taskStatusSchema));

export default getTaskStatus;
