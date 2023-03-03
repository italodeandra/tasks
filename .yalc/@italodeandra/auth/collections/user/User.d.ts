export interface IUserType {
    NORMAL: "NORMAL";
    ADMIN: "ADMIN";
}
export declare const UserType: IUserType;
declare const userSchema: [{
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
}, {
    defaults: {
        type: "NORMAL";
    };
    timestamps: true;
}];
declare const User: import("papr").Model<{
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
}, {
    defaults: {
        type: "NORMAL";
    };
    timestamps: true;
}>;
export declare type IUser = typeof userSchema[0];
export default User;
