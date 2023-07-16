import { schema, types, VALIDATION_ACTIONS, VALIDATION_LEVEL } from "papr";
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
      validationLevel: VALIDATION_LEVEL.OFF,
      validationAction: VALIDATION_ACTIONS.WARN,
    }
  )
);

export type ITimesheet = (typeof timesheetSchema)[0];

const Timesheet = onlyServer(() => db.model("timesheet", timesheetSchema));

export default Timesheet;
