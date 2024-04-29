import { ObjectId } from "bson";
export declare enum TenantFeature {
    ALL = "ALL"
}
declare const tenantSchema: [{
    createdAt: Date;
    updatedAt: Date;
    _id: ObjectId;
    name: string;
    subdomain: string;
    enabledFeatures?: TenantFeature[] | undefined;
}, {
    timestamps: true;
}];
declare const getTenant: () => import("papr").Model<{
    createdAt: Date;
    updatedAt: Date;
    _id: ObjectId;
    name: string;
    subdomain: string;
    enabledFeatures?: TenantFeature[] | undefined;
}, {
    timestamps: true;
}>;
export declare type ITenant = (typeof tenantSchema)[0];
export default getTenant;
