import { schema, types } from "papr";
import { onlyServer } from "@italodeandra/next/utils/isServer";
import db from "@italodeandra/next/db";

const projectSchema = onlyServer(() =>
  schema(
    {
      name: types.string({ required: true }),
      clientId: types.objectId(),
      archived: types.boolean(),
    },
    {
      timestamps: true,
    },
  ),
);

export type IProject = (typeof projectSchema)[0];

const getProject = () => onlyServer(() => db.model("projects2", projectSchema));

export default getProject;
