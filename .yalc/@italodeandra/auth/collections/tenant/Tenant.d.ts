import { ObjectId } from "bson";
declare const tenantSchema: [{
    createdAt: Date;
    updatedAt: Date;
    _id: ObjectId;
    name: string;
    subdomain: string;
}, {
    timestamps: true;
}];
declare const getTenant: () => import("papr").Model<{
    createdAt: Date;
    updatedAt: Date;
    _id: ObjectId;
    name: string;
    subdomain: string;
}, {
    timestamps: true;
}>;
export declare type ITenant = (typeof tenantSchema)[0];
export default getTenant;
