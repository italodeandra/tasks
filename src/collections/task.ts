import { schema, types } from "papr";
import { onlyServer } from "@italodeandra/next/utils/isServer";
import db from "@italodeandra/next/db";

const taskSchema = onlyServer(() =>
  schema(
    {
      title: types.string({ required: true }),
      description: types.string(),
      statusId: types.objectId(),
      columnId: types.objectId({ required: true }),
      projectId: types.objectId(),
      subProjectId: types.objectId(),
      archived: types.boolean(),
      assignees: types.array(types.objectId()),
      priority: types.number(),
      secondaryProjectsIds: types.array(types.objectId()),
      dependencies: types.array(types.objectId()),
      /**
       * @deprecated this field will be removed in favor of "priority"
       */
      order: types.number(),
    },
    {
      timestamps: true,
    },
  ),
);

export type ITask = (typeof taskSchema)[0];

const getTask = () => onlyServer(() => db.model("tasks2", taskSchema));

export default getTask;
