import { schema, types } from "papr";
import { onlyServer } from "@italodeandra/next/utils/isServer";
import db from "@italodeandra/next/db";
import { permission } from "./permission";

const boardSchema = onlyServer(() =>
  schema(
    {
      name: types.string({ required: true }),
      permissions: types.array(permission, { required: true }),
    },
    {
      timestamps: true,
    },
  ),
);

export type IBoard = (typeof boardSchema)[0];

const getBoard = () => onlyServer(() => db.model("boards", boardSchema));

export default getBoard;
