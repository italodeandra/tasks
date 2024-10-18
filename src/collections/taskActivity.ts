import { schema, types } from "papr";
import { onlyServer } from "@italodeandra/next/utils/isServer";
import db from "@italodeandra/next/db";

export enum ActivityType {
  CREATE = "CREATE",
  COMMENT = "COMMENT",
  MOVE = "MOVE",
  UPDATE = "UPDATE",
  SET = "SET",
  ASSIGN = "ASSIGN",
  DEPENDENCY = "DEPENDENCY",
  CHANGE_TITLE = "CHANGE_TITLE",
  DELETE = "DELETE",
  TIMESHEET = "TIMESHEET",
}

const taskActivitySchema = onlyServer(() =>
  schema(
    {
      taskId: types.objectId({ required: true }),
      type: types.enum(Object.values(ActivityType), { required: true }),
      data: types.any(),
      userId: types.objectId({ required: true }),
    },
    {
      timestamps: true,
    },
  ),
);

export type ITaskActivity = (typeof taskActivitySchema)[0];

const getTaskActivity = () =>
  onlyServer(() => db.model("taskActivities", taskActivitySchema));

export default getTaskActivity;
