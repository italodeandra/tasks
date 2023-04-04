import { NextApiRequest, NextApiResponse } from "next";
import { UseMutationOptions } from "@tanstack/react-query";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import { IUser } from "../../../collections/user/User";
import { InferApiArgs, InferApiResponse } from "@italodeandra/next/api/apiHandlerWrapper";
import { AuthConfig } from "../..";
interface UserUpdateError extends Error {
    status: "Existing";
}
export default function authPanelUserUpdateHandler(args: Jsonify<Pick<IUser, "_id" | "name" | "email" | "type">>, req: NextApiRequest, res: NextApiResponse, { connectDb }: AuthConfig): Promise<{
    _id: import("bson").ObjectID;
}>;
export declare type AuthPanelUserCreateResponse = InferApiResponse<typeof authPanelUserUpdateHandler>;
export declare type AuthPanelUserCreateArgs = InferApiArgs<typeof authPanelUserUpdateHandler>;
export declare const useAuthPanelUserUpdate: (options?: UseMutationOptions<AuthPanelUserCreateResponse, UserUpdateError, AuthPanelUserCreateArgs>) => import("@tanstack/react-query").UseMutationResult<{
    _id: string;
}, UserUpdateError, {
    email: string;
    type: string;
    _id: string;
    name?: string | undefined;
}, unknown>;
export {};
