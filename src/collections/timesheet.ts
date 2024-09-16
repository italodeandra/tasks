import { schema, types } from "papr";
import { onlyServer } from "@italodeandra/next/utils/isServer";
import db from "@italodeandra/next/db";

export enum TimesheetType {
  TASK = "TASK",
  EXPENSE = "EXPENSE",
  CLOSURE = "CLOSURE",
  CARRYOVER = "CARRYOVER",
}

const timesheetSchema = onlyServer(() =>
  schema(
    {
      boardId: types.objectId({ required: true }),
      type: types.enum(Object.values(TimesheetType), {
        required: true,
      }),
      userId: types.objectId(),
      taskId: types.objectId(),
      startedAt: types.date(),
      stoppedAt: types.date(),
      time: types.number(),

      // type Expense
      description: types.string(),
      projectId: types.objectId(),

      // type Closure
      usersMultipliers: types.array(
        types.object({
          userId: types.objectId({ required: true }),
          multiplier: types.number({ required: true }),
          overheadRate: types.number({ required: true }),
        }),
      ),
      hourlyRate: types.number(),
    },
    {
      timestamps: true,
    },
  ),
);

export type ITimesheet = (typeof timesheetSchema)[0];

const getTimesheet = () =>
  onlyServer(() => db.model("timesheets2", timesheetSchema));

export default getTimesheet;
