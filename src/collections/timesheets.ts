import { schema, types } from "papr";
import { onlyServer } from "@italodeandra/next/utils/isServer";
import db from "@italodeandra/next/db";

const timesheetSchema = onlyServer(() =>
  schema(
    {
      userId: types.objectId({ required: true }),
      taskId: types.objectId({ required: true }),
      startedAt: types.date(),
      stoppedAt: types.date(),
      time: types.number(),
    },
    {
      timestamps: true,
    },
  ),
);

export type ITimesheet = (typeof timesheetSchema)[0];

const getTimesheet = () =>
  onlyServer(() => db.model("timesheets", timesheetSchema));

export default getTimesheet;
