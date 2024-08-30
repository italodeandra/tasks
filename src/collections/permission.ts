import { types } from "papr";
import { onlyServer } from "@italodeandra/next/utils/isServer";

export enum PermissionLevel {
  READ = "READ",
  WRITE = "WRITE",
  ADMIN = "ADMIN",
}

export const permission = onlyServer(() =>
  types.object({
    userId: types.objectId(),
    teamId: types.objectId(),
    public: types.boolean(),
    level: types.enum(Object.values(PermissionLevel)),
  }),
);
