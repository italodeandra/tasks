import { apiHandlerWrapper } from "@italodeandra/next/api/apiHandlerWrapper";
import { connectDb } from "../../../db";
import { devSeed } from "../../../db/dev.seed";

async function handler() {
  await connectDb();

  await devSeed();

  return {
    ok: true,
  };
}

export default apiHandlerWrapper(handler);
