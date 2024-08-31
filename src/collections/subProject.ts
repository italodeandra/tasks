import { schema, types } from "papr";
import { onlyServer } from "@italodeandra/next/utils/isServer";
import db from "@italodeandra/next/db";
import { permission } from "./permission";

const subProjectSchema = onlyServer(() =>
  schema(
    {
      name: types.string({ required: true }),
      projectId: types.objectId({ required: true }),
      archived: types.boolean(),
      permissions: types.array(permission),
    },
    {
      timestamps: true,
    },
  ),
);

export type ISubProject = (typeof subProjectSchema)[0];

const getSubProject = () =>
  onlyServer(() => db.model("subProjects", subProjectSchema));

export default getSubProject;
