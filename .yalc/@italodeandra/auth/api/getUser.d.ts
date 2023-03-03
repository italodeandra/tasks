/// <reference types="node" />
import { QueryClient, UseQueryOptions } from "@tanstack/react-query";
import { InferApiResponse } from "@italodeandra/next/api/apiHandlerWrapper";
import { AuthConfig } from ".";
import { IUser } from "../collections/user/User";
import { OptionsType } from "cookies-next/lib/types";
export interface AuthUserGetApiError {
    code: 401;
}
export default function getUserHandler(_args: void, req: OptionsType["req"], res: OptionsType["res"], { connectToDb }: AuthConfig): Promise<import("mongodb").WithId<Pick<{
    email: string;
    password: string;
    passwordSalt: string;
    createdAt: Date;
    updatedAt: Date;
    _id: import("bson").ObjectID;
    emailVerified?: Date | undefined;
    type?: any;
    name?: string | undefined;
    phoneNumber?: string | undefined;
}, "email" | "type" | "name" | "_id">>>;
export declare type AuthUserGetApiResponse = InferApiResponse<typeof getUserHandler>;
export declare const useAuthGetUser: (required?: boolean, options?: UseQueryOptions<AuthUserGetApiResponse | null, AuthUserGetApiError>) => import("@tanstack/react-query").UseQueryResult<{
    email: string;
    type?: any;
    name?: string | undefined;
    _id: string;
} | null, AuthUserGetApiError>;
export declare const useAuthRequiredUserType: (typesToCheck: IUser["type"][], redirectTo?: string) => boolean;
export declare const useAuthRequiredUser: (redirectTo?: string) => boolean;
export declare const useAuthUser: () => boolean;
export declare const prefetch_authGetUser: (queryClient: QueryClient, args_0: void, args_1: (import("http").IncomingMessage & {
    cookies?: {
        [key: string]: string;
    } | Partial<{
        [key: string]: string;
    }> | undefined;
}) | undefined, args_2: import("http").ServerResponse<import("http").IncomingMessage> | undefined, args_3: AuthConfig) => Promise<void>;
export declare const setData_authGetUser: (queryClient: QueryClient, data: AuthUserGetApiResponse | null) => {
    email: string;
    type?: any;
    name?: string | undefined;
    _id: string;
} | null | undefined;
export declare const invalidate_authGetUser: (queryClient: QueryClient) => Promise<void>;
