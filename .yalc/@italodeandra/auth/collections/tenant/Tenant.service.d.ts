import { ObjectId } from "bson";
export declare function getTenantId(req: {
    headers: {
        host?: string;
    };
}): Promise<ObjectId | undefined>;
