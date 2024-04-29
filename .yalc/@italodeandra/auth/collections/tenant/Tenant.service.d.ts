export declare function getSubdomain(urlOrReq?: string | {
    headers: {
        host?: string;
    };
}): string | undefined;
export declare function getReqTenant(req: {
    headers: {
        host?: string;
    };
}): Promise<import("mongodb").WithId<Pick<{
    createdAt: Date;
    updatedAt: Date;
    _id: import("bson").ObjectID;
    name: string;
    subdomain: string;
    enabledFeatures?: import("./Tenant").TenantFeature[] | undefined;
}, "_id" | "subdomain" | "enabledFeatures">> | null>;
