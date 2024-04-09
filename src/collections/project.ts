import { schema, types } from "papr";
import { onlyServer } from "@italodeandra/next/utils/isServer";
import db from "@italodeandra/next/db";

const projectSchema = onlyServer(() =>
  schema(
    {
      name: types.string({ required: true }),
      userId: types.objectId({ required: true }),
      archived: types.boolean(),
    },
    {
      timestamps: true,
    }
  )
);

export type IProject = (typeof projectSchema)[0];

const getProject = () => onlyServer(() => db.model("projects", projectSchema));

export default getProject;
