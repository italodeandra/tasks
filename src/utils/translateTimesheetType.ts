import { TimesheetType } from "../collections/timesheet";

export function translateTimesheetType(type: TimesheetType) {
  return {
    [TimesheetType.CLOCK_IN_OUT]: "Clock in/out",
    [TimesheetType.MANUAL]: "Manual",
    [TimesheetType.PAYMENT]: "Payment",
  }[type];
}
