import papr from "@italodeandra/next/db";
import getComment from "../collections/comment";
import getProject from "../collections/project";
import getTask from "../collections/task";
import getTimesheet from "../collections/timesheet";

export default async function migration() {
  console.info("Updating schemas");

  getProject();
  getComment();
  getTask();
  getTimesheet();
  await papr.updateSchemas();
}
