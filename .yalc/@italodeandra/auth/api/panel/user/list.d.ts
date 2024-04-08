import { QueryClient } from "@tanstack/react-query";
import { AuthConfig } from "../..";
import { InferApiArgs, InferApiResponse } from "@italodeandra/next/api/apiHandlerWrapper";
import { NextApiRequest, NextApiResponse } from "next";
export default function authPanelUserListHandler(args: {
    search?: string;
    sort?: string;
    sortDirection?: "asc" | "desc";
}, req: NextApiRequest, res: NextApiResponse, { connectDb, multitenantMode }: AuthConfig): Promise<import("mongodb").WithId<Pick<{
    email: string;
    type: string;
    password: string;
    passwordSalt: string;
    createdAt: Date;
    updatedAt: Date;
    _id: import("bson").ObjectID;
    tenantId?: import("bson").ObjectID | undefined;
    emailVerified?: Date | undefined;
    name?: string | undefined;
    phoneNumber?: string | undefined;
    customData?: Pick<{}, never> | undefined;
}, "email" | "type" | "createdAt" | "updatedAt" | "_id" | "name">>[]>;
export declare type AuthPanelUserListApiArgs = InferApiArgs<typeof authPanelUserListHandler>;
export declare type AuthPanelUserListApiResponse = InferApiResponse<typeof authPanelUserListHandler>;
export declare const useAuthPanelUserList: (args?: AuthPanelUserListApiArgs) => import("@tanstack/react-query").UseQueryResult<{
    email: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    name?: string | undefined;
    _id: string;
}[], unknown>;
export declare const prefetch_authPanelUserList: (queryClient: QueryClient, args_0: {
    search?: string | undefined;
    sort?: string | undefined;
    sortDirection?: "asc" | "desc" | undefined;
}, args_1: NextApiRequest, args_2: NextApiResponse<any>, args_3: AuthConfig) => Promise<void>;
export declare const invalidate_authPanelUserList: (queryClient: QueryClient) => Promise<void>;
