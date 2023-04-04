import { NextApiRequest, NextApiResponse } from "next";
import { UseMutationOptions } from "@tanstack/react-query";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import { IUser } from "../../../collections/user/User";
import { InferApiArgs, InferApiResponse } from "@italodeandra/next/api/apiHandlerWrapper";
import { AuthConfig } from "../..";
interface UserCreateError extends Error {
    status: "Existing";
}
export default function authPanelUserCreateHandler(args: Jsonify<Pick<IUser, "name" | "email" | "type">>, req: NextApiRequest, res: NextApiResponse, { connectDb }: AuthConfig): Promise<{
    _id: import("bson").ObjectID;
}>;
export declare type AuthPanelUserCreateResponse = InferApiResponse<typeof authPanelUserCreateHandler>;
export declare type AuthPanelUserCreateArgs = InferApiArgs<typeof authPanelUserCreateHandler>;
export declare const useAuthPanelUserCreate: (options?: UseMutationOptions<AuthPanelUserCreateResponse, UserCreateError, AuthPanelUserCreateArgs>) => import("@tanstack/react-query").UseMutationResult<{
    _id: string;
}, UserCreateError, {
    email: string;
    type: string;
    name?: string | undefined;
}, unknown>;
export {};
