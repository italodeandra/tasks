import { schema, types } from "papr";
import { onlyServer } from "@italodeandra/next/utils/isServer";
import db from "@italodeandra/next/db";

export enum MemberRole {
  MEMBER = "MEMBER",
  ADMIN = "ADMIN",
}

const teamSchema = onlyServer(() =>
  schema(
    {
      name: types.string({ required: true }),
      members: types.array(
        types.object({
          userId: types.objectId({ required: true }),
          role: types.enum(Object.values(MemberRole), { required: true }),
        }),
        { required: true },
      ),
    },
    {
      timestamps: true,
    },
  ),
);

export type ITeam = (typeof teamSchema)[0];

const getTeam = () => onlyServer(() => db.model("teams", teamSchema));

export default getTeam;
