import { schema, types } from "papr";
import { onlyServer } from "@italodeandra/next/utils/isServer";
import db from "@italodeandra/next/db";

const taskStatusSchema = onlyServer(() =>
  schema(
    {
      boardId: types.objectId({ required: true }),
      title: types.string({ required: true }),
    },
    {
      timestamps: true,
    },
  ),
);

export type ITaskStatus = (typeof taskStatusSchema)[0];

const getTaskStatus = () =>
  onlyServer(() => db.model("taskStatuses", taskStatusSchema));

export default getTaskStatus;
