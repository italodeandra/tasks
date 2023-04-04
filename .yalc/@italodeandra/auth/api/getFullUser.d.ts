import { QueryClient } from "@tanstack/react-query";
import { InferApiResponse } from "@italodeandra/next/api/apiHandlerWrapper";
import { AuthConfig } from "./index";
import { OptionsType } from "cookies-next/lib/types";
export default function getFullUserHandler(_args: void, req: OptionsType["req"], res: OptionsType["res"], { connectDb }: AuthConfig): Promise<import("mongodb").WithId<Pick<{
    email: string;
    type: string;
    password: string;
    passwordSalt: string;
    createdAt: Date;
    updatedAt: Date;
    _id: import("bson").ObjectID;
    emailVerified?: Date | undefined;
    name?: string | undefined;
    phoneNumber?: string | undefined;
    customData?: Pick<{}, never> | undefined;
}, "email" | "type" | "_id" | "name" | "phoneNumber" | "customData">>>;
export declare type AuthGetFullUserApiResponse = InferApiResponse<typeof getFullUserHandler>;
export declare const useAuthGetFullUser: (required?: boolean) => import("@tanstack/react-query").UseQueryResult<{
    email: string;
    type: string;
    name?: string | undefined;
    phoneNumber?: string | undefined;
    customData?: {} | undefined;
    _id: string;
} | null, {
    code: 401;
}>;
export declare const invalidate_authGetFullUser: (queryClient: QueryClient) => Promise<void>;
export declare const setData_authGetFullUser: (queryClient: QueryClient, data: null) => null | undefined;
