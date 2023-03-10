import { NextApiRequest, NextApiResponse } from "next";
import { UseMutationOptions } from "@tanstack/react-query";
import { AuthConfig } from ".";
import { InferApiArgs } from "@italodeandra/next/api/apiHandlerWrapper";
export default function requestPasswordResetHandler(args: {
    email: string;
}, req: NextApiRequest, res: NextApiResponse, { routes, connectDb, intl, fallbackLocale, primaryColor, sendMail, }: AuthConfig): Promise<void>;
export declare type AuthRequestPasswordResetArgs = InferApiArgs<typeof requestPasswordResetHandler>;
export declare const useAuthRequestPasswordReset: (options?: UseMutationOptions<void, Error, AuthRequestPasswordResetArgs>) => import("@tanstack/react-query").UseMutationResult<void, Error, {
    email: string;
}, unknown>;
