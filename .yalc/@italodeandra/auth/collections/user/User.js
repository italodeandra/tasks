"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserType = void 0;
var papr_1 = require("papr");
var isServer_1 = require("@italodeandra/next/utils/isServer");
var db_1 = __importDefault(require("@italodeandra/next/db"));
exports.UserType = {
    NORMAL: "NORMAL",
    ADMIN: "ADMIN",
};
var userSchema = (0, isServer_1.onlyServer)(function () {
    return (0, papr_1.schema)({
        _id: papr_1.types.objectId({ required: true }),
        email: papr_1.types.string({
            required: true,
            maxLength: 255,
        }),
        emailVerified: papr_1.types.date(),
        type: papr_1.types.string({ required: true }),
        password: papr_1.types.string({
            required: true,
            maxLength: 130,
        }),
        passwordSalt: papr_1.types.string({
            required: true,
            maxLength: 60,
        }),
        name: papr_1.types.string({
            maxLength: 100,
        }),
        phoneNumber: papr_1.types.string(),
        createdAt: papr_1.types.date({ required: true }),
        updatedAt: papr_1.types.date({ required: true }),
        customData: papr_1.types.any(),
    }, {
        defaults: {
            type: exports.UserType.NORMAL,
        },
        timestamps: true,
    });
});
var User = (0, isServer_1.onlyServer)(function () { return db_1.default.model("users", userSchema); });
exports.default = User;
