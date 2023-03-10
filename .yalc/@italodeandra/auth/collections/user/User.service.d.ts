/// <reference types="node" />
import { ObjectId } from "bson";
import { IUser, IUserType } from "./User";
import { NextApiResponse } from "next";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
import { ServerResponse } from "http";
import { OptionsType } from "cookies-next/lib/types";
export declare function hashPassword(plainPassword: string, salt: string): string;
export declare function generateSalt(): string;
export declare function checkUserPassword(user: Pick<IUser, "password" | "passwordSalt">, plainPassword: string): boolean;
export declare function generateToken(userId: ObjectId): string;
export declare function readToken(token: string): ObjectId;
export declare function generateResetPasswordToken(userEmail: IUser["email"]): string;
export declare function readResetPasswordToken(token: string): string;
export declare function checkUserType(user: Pick<IUser, "type"> | undefined | null, typesToCheck: IUser["type"][]): any;
export declare function convertToUserType(userType: string): "NORMAL" | "ADMIN";
export declare function createUser(doc: Pick<IUser, "email" | "password" | "name"> & Partial<Omit<IUser, "email" | "password" | "name">>): Promise<{
    email: string;
    password: string;
    passwordSalt: string;
    createdAt: Date;
    updatedAt: Date;
    _id: ObjectId;
    emailVerified?: Date | undefined;
    type?: any;
    name?: string | undefined;
    phoneNumber?: string | undefined;
}>;
export declare type Request = {
    cookies: NextApiRequestCookies;
};
export declare type Response = NextApiResponse | ServerResponse;
export declare function getAuthCookies(req: OptionsType["req"], res: OptionsType["res"]): string | undefined;
export declare function getUserFromCookies(req: OptionsType["req"], res: OptionsType["res"]): Promise<import("mongodb").WithId<Pick<{
    email: string;
    password: string;
    passwordSalt: string;
    createdAt: Date;
    updatedAt: Date;
    _id: ObjectId;
    emailVerified?: Date | undefined;
    type?: any;
    name?: string | undefined;
    phoneNumber?: string | undefined;
}, "email" | "type" | "name" | "_id">> | null>;
export declare function getFullUserFromCookies(req: OptionsType["req"], res: OptionsType["res"]): Promise<import("mongodb").WithId<Pick<{
    email: string;
    password: string;
    passwordSalt: string;
    createdAt: Date;
    updatedAt: Date;
    _id: ObjectId;
    emailVerified?: Date | undefined;
    type?: any;
    name?: string | undefined;
    phoneNumber?: string | undefined;
}, "email" | "type" | "name" | "phoneNumber" | "_id">> | null>;
export declare function setUserPassword(userId: IUser["_id"], plainPassword: string): Promise<void>;
export declare const userTypeTranslations: {
    ADMIN: string;
    NORMAL: string;
};
export declare function translateUserType(userType: IUserType): string;
