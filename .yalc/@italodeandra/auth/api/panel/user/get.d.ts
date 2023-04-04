import { QueryClient, UseQueryOptions } from "@tanstack/react-query";
import { ObjectId } from "bson";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import { NextApiRequest, NextApiResponse } from "next";
import { AuthConfig } from "../..";
import { InferApiArgs, InferApiResponse } from "@italodeandra/next/api/apiHandlerWrapper";
export default function panelUserGetHandler(args: Jsonify<{
    _id: ObjectId;
}>, req: NextApiRequest, res: NextApiResponse, { connectDb }: AuthConfig): Promise<import("mongodb").WithId<Pick<{
    email: string;
    type: string;
    password: string;
    passwordSalt: string;
    createdAt: Date;
    updatedAt: Date;
    _id: ObjectId;
    emailVerified?: Date | undefined;
    name?: string | undefined;
    phoneNumber?: string | undefined;
    customData?: Pick<{}, never> | undefined;
}, "email" | "type" | "_id" | "name">>>;
export declare type AuthPanelUserGetApiResponse = InferApiResponse<typeof panelUserGetHandler>;
export declare type AuthPanelUserGetApiArgs = InferApiArgs<typeof panelUserGetHandler>;
export declare const useAuthPanelUserGet: (args?: AuthPanelUserGetApiArgs, options?: UseQueryOptions<AuthPanelUserGetApiResponse>) => import("@tanstack/react-query").UseQueryResult<{
    email: string;
    type: string;
    name?: string | undefined;
    _id: string;
}, unknown>;
export declare const prefetch_authPanelUserGet: (queryClient: QueryClient, args_0: {
    _id: string;
}, args_1: NextApiRequest, args_2: NextApiResponse<any>, args_3: AuthConfig) => Promise<void>;
export declare const invalidate_authPanelUserGet: (queryClient: QueryClient, args: Parameters<typeof panelUserGetHandler>[0]) => Promise<void>;
export declare const remove_authPanelUserGet: (queryClient: QueryClient, args: Parameters<typeof panelUserGetHandler>[0]) => void;
