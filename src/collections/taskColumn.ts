import { schema, types } from "papr";
import { onlyServer } from "@italodeandra/next/utils/isServer";
import db from "@italodeandra/next/db";

const taskColumnSchema = onlyServer(() =>
  schema(
    {
      boardId: types.objectId({ required: true }),
      title: types.string({ required: true }),
      order: types.number({ required: true }),
      archived: types.boolean(),
    },
    {
      timestamps: true,
    },
  ),
);

export type ITaskColumn = (typeof taskColumnSchema)[0];

const getTaskColumn = () =>
  onlyServer(() => db.model("taskColumns", taskColumnSchema));

export default getTaskColumn;
