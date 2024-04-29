import authMigration from "@italodeandra/auth/db/migration";
import authSeed from "@italodeandra/auth/db/seed";
import { connectDb as connect } from "@italodeandra/next/db";
import { seed } from "./dev.seed";
import migration from "./migration";

export async function connectDb() {
  await connect([migration, authMigration, () => authSeed(false), seed]);
}
