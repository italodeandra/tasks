import { AuthConfig } from "./index";
import { NextApiRequest } from "next";
export declare const authGetTenantApi: {
    handler: import("next").NextApiHandler<any>;
    unwrappedHandler: (_args: any, req: NextApiRequest, _res: any, { connectDb }: AuthConfig) => Promise<import("mongodb").WithId<Pick<{
        createdAt: Date;
        updatedAt: Date;
        _id: import("bson").ObjectID;
        name: string;
        subdomain: string;
        enabledFeatures?: import("../collections/tenant/Tenant").TenantFeature[] | undefined;
    }, "_id" | "enabledFeatures">> | null>;
    Types: {
        Args: any;
        Response: {
            enabledFeatures?: import("../collections/tenant/Tenant").TenantFeature[] | undefined;
            _id: string;
        } | null;
        QueryOptions: import("@tanstack/react-query").UseQueryOptions<{
            enabledFeatures?: import("../collections/tenant/Tenant").TenantFeature[] | undefined;
            _id: string;
        } | null, unknown, {
            enabledFeatures?: import("../collections/tenant/Tenant").TenantFeature[] | undefined;
            _id: string;
        } | null, import("@tanstack/query-core").QueryKey>;
        MutationOptions: import("@tanstack/react-query").UseMutationOptions<{
            enabledFeatures?: import("../collections/tenant/Tenant").TenantFeature[] | undefined;
            _id: string;
        } | null, unknown, any, unknown>;
    };
    useQuery: (args?: any, options?: import("@tanstack/react-query").UseQueryOptions<{
        enabledFeatures?: import("../collections/tenant/Tenant").TenantFeature[] | undefined;
        _id: string;
    } | null, unknown, {
        enabledFeatures?: import("../collections/tenant/Tenant").TenantFeature[] | undefined;
        _id: string;
    } | null, import("@tanstack/query-core").QueryKey> | undefined) => import("@tanstack/react-query").UseQueryResult<{
        enabledFeatures?: import("../collections/tenant/Tenant").TenantFeature[] | undefined;
        _id: string;
    } | null, unknown>;
    useMutation: (options?: import("@tanstack/react-query").UseMutationOptions<{
        enabledFeatures?: import("../collections/tenant/Tenant").TenantFeature[] | undefined;
        _id: string;
    } | null, unknown, any, unknown> | undefined) => import("@tanstack/react-query").UseMutationResult<{
        enabledFeatures?: import("../collections/tenant/Tenant").TenantFeature[] | undefined;
        _id: string;
    } | null, unknown, any, Record<string, any>>;
    invalidate: (queryClient: import("@tanstack/query-core").QueryClient, args?: any) => Promise<void>;
    refetchQueries: (queryClient: import("@tanstack/query-core").QueryClient, args?: any) => Promise<void>;
    cancelQueries: (queryClient: import("@tanstack/query-core").QueryClient, args?: any) => Promise<void>;
    getQueryData: (queryClient: import("@tanstack/query-core").QueryClient, args?: any) => {
        enabledFeatures?: import("../collections/tenant/Tenant").TenantFeature[] | undefined;
        _id: string;
    } | null | undefined;
    setQueryData: (queryClient: import("@tanstack/query-core").QueryClient, updater: any, args?: any) => {
        enabledFeatures?: import("../collections/tenant/Tenant").TenantFeature[] | undefined;
        _id: string;
    } | null | undefined;
};
