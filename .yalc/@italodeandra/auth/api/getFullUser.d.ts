import { QueryClient, UseQueryResult } from "@tanstack/react-query";
import { InferApiResponse } from "@italodeandra/next/api/apiHandlerWrapper";
import { AuthConfig } from "./index";
import { IUser } from "../collections/user/User";
import { NextApiRequest, NextApiResponse } from "next";
export default function getFullUserHandler(_args: void, req: NextApiRequest, res: NextApiResponse, { connectDb, multitenantMode }: AuthConfig): Promise<Pick<{
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
    customData?: import("../collections/user/User").UserCustomData | undefined;
}, "email" | "type" | "_id" | "name" | "phoneNumber" | "customData">>;
export declare type AuthGetFullUserApiResponse = InferApiResponse<typeof getFullUserHandler>;
export declare const useAuthGetFullUser: (required?: boolean) => UseQueryResult<null | Pick<IUser, "_id" | "email" | "type" | "name" | "phoneNumber" | "customData">, {
    code: 401;
}>;
export declare const invalidate_authGetFullUser: (queryClient: QueryClient) => Promise<void>;
export declare const setData_authGetFullUser: (queryClient: QueryClient, data: null) => null | undefined;
