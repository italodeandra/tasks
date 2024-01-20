import { schema, types } from "papr";
import { onlyServer } from "@italodeandra/next/utils/isServer";
import db from "@italodeandra/next/db";

export enum TimesheetType {
  CLOCK_IN_OUT = "CLOCK_IN_OUT",
  PAYMENT = "PAYMENT",
  MANUAL = "MANUAL",
}

const timesheetSchema = onlyServer(() =>
  schema(
    {
      type: types.enum(Object.values(TimesheetType), { required: true }),
      startedAt: types.date(),
      stoppedAt: types.date(),
      time: types.number(),
      projectId: types.objectId(),
      userId: types.objectId({ required: true }),
      taskId: types.objectId(),
    },
    {
      timestamps: true,
    }
  )
);

export type ITimesheet = (typeof timesheetSchema)[0];

const getTimesheet = () =>
  onlyServer(() => db.model("timesheet", timesheetSchema));

export default getTimesheet;
