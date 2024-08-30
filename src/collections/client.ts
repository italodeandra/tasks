import { schema, types } from "papr";
import { onlyServer } from "@italodeandra/next/utils/isServer";
import db from "@italodeandra/next/db";
import { permission } from "./permission";

const clientSchema = onlyServer(() =>
  schema(
    {
      name: types.string({ required: true }),
      boardId: types.objectId({ required: true }),
      archived: types.boolean(),
      permissions: types.array(permission),
    },
    {
      timestamps: true,
    },
  ),
);

export type IClient = (typeof clientSchema)[0];

const getClient = () => onlyServer(() => db.model("clients2", clientSchema));

export default getClient;
