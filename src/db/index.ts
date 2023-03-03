import { MongoClient, MongoClientOptions } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import Papr from "papr";

let isDev = process.env.NODE_ENV === "development";
let uri = process.env.MONGODB_URI;

let options: MongoClientOptions = {};

export let client: MongoClient;
let papr = new Papr();

export async function connectDb() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (global._dbPromise) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return global._dbPromise;
  }

  let connect = async () => {
    if (!uri) {
      let mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
    }
    client = new MongoClient(uri, options);
    await client.connect();

    papr.initialize(client.db());
  };

  if (isDev) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global._dbPromise = connect;
    await connect();
  }

  await connect();
}

export default papr;
