import { ObjectId } from "bson";
export interface IUserType {
    NORMAL: "NORMAL";
    ADMIN: "ADMIN";
}
export declare const UserType: IUserType;
export interface UserCustomData {
}
declare const userSchema: [{
    email: string;
    type: string;
    password: string;
    passwordSalt: string;
    createdAt: Date;
    updatedAt: Date;
    _id: ObjectId;
    tenantId?: ObjectId | undefined;
    emailVerified?: Date | undefined;
    name?: string | undefined;
    phoneNumber?: string | undefined;
    customData?: UserCustomData | undefined;
}, {
    defaults: {
        type: "NORMAL";
    };
    timestamps: true;
}];
declare const getUser: () => import("papr").Model<{
    email: string;
    type: string;
    password: string;
    passwordSalt: string;
    createdAt: Date;
    updatedAt: Date;
    _id: ObjectId;
    tenantId?: ObjectId | undefined;
    emailVerified?: Date | undefined;
    name?: string | undefined;
    phoneNumber?: string | undefined;
    customData?: UserCustomData | undefined;
}, {
    defaults: {
        type: "NORMAL";
    };
    timestamps: true;
}>;
export declare type IUser = (typeof userSchema)[0];
export default getUser;
