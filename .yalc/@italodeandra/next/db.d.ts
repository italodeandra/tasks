import Papr from "papr";
import { Db } from "mongodb";
import { Promisable } from "type-fest";
export declare const connectToDb: () => Promise<Papr>;
export declare function prepareConnectToDb(args?: {
    seeds?: ((db: Db, papr: Papr) => Promisable<void>)[];
    migrations?: ((db: Db, papr: Papr) => Promisable<void>)[];
    uri?: string;
}): () => Promise<Papr>;
declare const _default: Papr;
export default _default;
