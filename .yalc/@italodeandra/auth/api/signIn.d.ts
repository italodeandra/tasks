import { NextApiRequest, NextApiResponse } from "next";
import { UseMutationOptions } from "@tanstack/react-query";
import { AuthConfig } from ".";
import { InferApiArgs, InferApiResponse } from "@italodeandra/next/api/apiHandlerWrapper";
export interface AuthSignInApiError {
    code: 401;
}
export default function signInHandler(args: {
    email: string;
    password: string;
}, req: NextApiRequest, res: NextApiResponse, { connectDb }: AuthConfig): Promise<Pick<import("mongodb").WithId<Pick<{
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
}, "email" | "type" | "password" | "passwordSalt" | "_id">>, "email" | "type" | "_id">>;
export declare type AuthSignInApiArgs = InferApiArgs<typeof signInHandler>;
export declare type AuthSignInApiResponse = InferApiResponse<typeof signInHandler>;
export declare const useAuthSignIn: (options?: UseMutationOptions<AuthSignInApiResponse, AuthSignInApiError, AuthSignInApiArgs>) => import("@tanstack/react-query").UseMutationResult<{
    email: string;
    type: string;
    _id: string;
}, AuthSignInApiError, {
    email: string;
    password: string;
}, unknown>;
