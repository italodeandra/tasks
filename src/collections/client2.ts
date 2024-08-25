import { schema, types } from "papr";
import { onlyServer } from "@italodeandra/next/utils/isServer";
import db from "@italodeandra/next/db";

const clientSchema = onlyServer(() =>
  schema(
    {
      name: types.string({ required: true }),
      archived: types.boolean(),
      participants: types.object({
        teamsIds: types.array(types.objectId({ required: true })),
        usersIds: types.array(types.objectId({ required: true })),
      }),
    },
    {
      timestamps: true,
    },
  ),
);

export type IClient = (typeof clientSchema)[0];

const getClient = () => onlyServer(() => db.model("clients2", clientSchema));

export default getClient;
