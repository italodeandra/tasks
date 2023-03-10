import { QueryClient } from "@tanstack/react-query";
import { InferApiResponse } from "@italodeandra/next/api/apiHandlerWrapper";
import { AuthConfig } from "./index";
import { OptionsType } from "cookies-next/lib/types";
export default function getFullUserHandler(_args: void, req: OptionsType["req"], res: OptionsType["res"], { connectDb }: AuthConfig): Promise<import("mongodb").WithId<Pick<{
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
}, "email" | "type" | "name" | "phoneNumber" | "_id">>>;
export declare type AuthGetFullUserApiResponse = InferApiResponse<typeof getFullUserHandler>;
export declare const useAuthGetFullUser: (required?: boolean) => import("@tanstack/react-query").UseQueryResult<{
    email: string;
    type?: any;
    name?: string | undefined;
    phoneNumber?: string | undefined;
    _id: string;
} | null, {
    code: 401;
}>;
export declare const invalidate_authGetFullUser: (queryClient: QueryClient) => Promise<void>;
export declare const setData_authGetFullUser: (queryClient: QueryClient, data: null) => null | undefined;
