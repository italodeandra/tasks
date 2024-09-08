import papr from "@italodeandra/next/db";
import getProject from "../collections/project";
import getSubProject from "../collections/subProject";
import getTask from "../collections/task";
import getTaskActivity from "../collections/taskActivity";
import getTaskColumn from "../collections/taskColumn";
import getTaskStatus from "../collections/taskStatus";
import getTimesheet from "../collections/timesheet";

export default async function migration() {
  console.info("Updating schemas");

  const Project = getProject();
  await Project.collection.createIndex({ boardId: 1, archived: 1 });

  const SubProject = getSubProject();
  await SubProject.collection.createIndex({ projectId: 1, archived: 1 });

  const Task = getTask();
  await Task.collection.createIndex({ columnId: 1, archived: 1 });

  const TaskActivity = getTaskActivity();
  await TaskActivity.collection.createIndex({ taskId: 1 });

  const TaskColumn = getTaskColumn();
  await TaskColumn.collection.createIndex({ boardId: 1, archived: 1 });

  const TaskStatus = getTaskStatus();
  await TaskStatus.collection.createIndex({ boardId: 1 });

  const Timesheet = getTimesheet();
  await Timesheet.collection.createIndex({ boardId: 1 });
  await Timesheet.collection.createIndex({ taskId: 1 });
  await Timesheet.collection.createIndex({ userId: 1 });

  await papr.updateSchemas();
}
