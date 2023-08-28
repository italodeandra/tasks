import { NextApiRequest, NextApiResponse } from "next";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import { IUser } from "../../../collections/user/User";
import { AuthConfig } from "../..";
import { InferApiArgs, InferApiResponse } from "@italodeandra/next/api/apiHandlerWrapper";
import { UseMutationOptions } from "@tanstack/react-query";
import authPanelUserUpdateHandler from "./update";
import { AxiosError } from "axios";
export default function authPanelUserImpersonateHandler(args: Jsonify<Pick<IUser, "_id">>, req: NextApiRequest, res: NextApiResponse, { connectDb }: AuthConfig): Promise<void>;
export declare type AuthPanelUserImpersonateResponse = InferApiResponse<typeof authPanelUserUpdateHandler>;
export declare type AuthPanelUserImpersonateArgs = InferApiArgs<typeof authPanelUserUpdateHandler>;
export declare const useAuthPanelUserImpersonate: (options?: UseMutationOptions<AuthPanelUserImpersonateResponse, AxiosError, AuthPanelUserImpersonateArgs>) => import("@tanstack/react-query").UseMutationResult<{
    _id: string;
}, AxiosError<unknown, any>, {
    email: string;
    type: string;
    _id: string;
    name?: string | undefined;
    customData?: {} | undefined;
}, unknown>;
