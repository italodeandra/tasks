import { schema, types } from "papr";
import { onlyServer } from "@italodeandra/next/utils/isServer";
import db from "@italodeandra/next/db";

const clientSchema = onlyServer(() =>
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

export type IClient = (typeof clientSchema)[0];

const getClient = () => onlyServer(() => db.model("clients", clientSchema));

export default getClient;
