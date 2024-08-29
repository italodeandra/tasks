import { schema, types } from "papr";
import { onlyServer } from "@italodeandra/next/utils/isServer";
import db from "@italodeandra/next/db";
import { permission } from "./permission";

const projectSchema = onlyServer(() =>
  schema(
    {
      name: types.string({ required: true }),
      clientId: types.objectId(),
      archived: types.boolean(),
      permissions: types.array(permission, { required: true }),
    },
    {
      timestamps: true,
    },
  ),
);

export type IProject = (typeof projectSchema)[0];

const getProject = () => onlyServer(() => db.model("projects2", projectSchema));

export default getProject;
