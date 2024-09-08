import { TimesheetType } from "../collections/timesheet";

export function translateTimesheetType(type: TimesheetType) {
  return {
    [TimesheetType.TASK]: "Task",
    [TimesheetType.CLOSURE]: "Time Closure",
    [TimesheetType.CARRYOVER]: "Carryover Time",
    [TimesheetType.EXPENSE]: "Expense",
  }[type];
}
