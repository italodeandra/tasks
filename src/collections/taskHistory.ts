import { schema, types } from "papr";
import { onlyServer } from "@italodeandra/next/utils/isServer";
import db from "@italodeandra/next/db";

const taskHistorySchema = onlyServer(() =>
  schema(
    {
      taskId: types.objectId({ required: true }),
      content: types.string({ required: true }),
      createdByUserId: types.objectId({ required: true }),
    },
    {
      timestamps: true,
    },
  ),
);

export type ITaskHistory = (typeof taskHistorySchema)[0];

const getTaskHistory = () =>
  onlyServer(() => db.model("taskHistory", taskHistorySchema));

export default getTaskHistory;
