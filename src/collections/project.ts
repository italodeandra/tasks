import { schema, types } from "papr";
import { onlyServer } from "@italodeandra/next/utils/isServer";
import db from "@italodeandra/next/db";

export enum ProjectColor {
  RED = "RED",
  GREEN = "GREEN",
  BLUE = "BLUE",
  PINK = "PINK",
  ORANGE = "ORANGE",
}

const projectSchema = onlyServer(() =>
  schema(
    {
      name: types.string({ required: true }),
      color: types.enum(Object.values(ProjectColor), { required: true }),
      userId: types.objectId({ required: true }),
      archived: types.boolean(),
    },
    {
      timestamps: true,
    }
  )
);

export type IProject = (typeof projectSchema)[0];

const Project = onlyServer(() => db.model("projects", projectSchema));

export default Project;
