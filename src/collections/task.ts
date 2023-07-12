import { schema, types, VALIDATION_ACTIONS, VALIDATION_LEVEL } from "papr";
import { onlyServer } from "@italodeandra/next/utils/isServer";
import db from "@italodeandra/next/db";

export enum TaskStatus {
  TODO = "TODO",
  DOING = "DOING",
  DONE = "DONE",
}

const taskSchema = onlyServer(() =>
  schema(
    {
      content: types.string({ required: true }),
      status: types.enum(Object.values(TaskStatus), { required: true }),
      projectId: types.objectId(),
      userId: types.objectId({ required: true }),
      order: types.number({ required: true }),
      timesheet: types.object({
        time: types.number(),
        currentClockIn: types.date(),
        history: types.array(
          types.object({
            _id: types.objectId({ required: true }),
            time: types.number({ required: true }),
            startedAt: types.date({
              required: true,
            }),
            stoppedAt: types.date({
              required: true,
            }),
          })
        ),
      }),
      projectUpdatedAt: types.date(),
    },
    {
      timestamps: true,
      validationLevel: VALIDATION_LEVEL.OFF,
      validationAction: VALIDATION_ACTIONS.WARN,
    }
  )
);

export type ITask = (typeof taskSchema)[0];

const Task = onlyServer(() => db.model("tasks", taskSchema));

export default Task;
