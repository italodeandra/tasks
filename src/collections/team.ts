import { schema, types } from "papr";
import { onlyServer } from "@italodeandra/next/utils/isServer";
import db from "@italodeandra/next/db";

const teamSchema = onlyServer(() =>
  schema(
    {
      name: types.string({ required: true }),
      members: types.array(types.objectId({ required: true })),
    },
    {
      timestamps: true,
    },
  ),
);

export type ITeam = (typeof teamSchema)[0];

const getTeam = () => onlyServer(() => db.model("teams", teamSchema));

export default getTeam;
