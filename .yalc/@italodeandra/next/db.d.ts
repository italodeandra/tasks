import { MongoClient } from "mongodb";
import Papr from "papr";
export declare let client: MongoClient;
declare let papr: Papr;
export declare function connectDb(afterConnected?: (() => Promise<void>)[]): Promise<void>;
export default papr;
