"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantFeature = void 0;
var db_1 = __importDefault(require("@italodeandra/next/db"));
var isServer_1 = require("@italodeandra/next/utils/isServer");
var papr_1 = require("papr");
var TenantFeature;
(function (TenantFeature) {
    TenantFeature["ALL"] = "ALL";
})(TenantFeature = exports.TenantFeature || (exports.TenantFeature = {}));
var tenantSchema = (0, isServer_1.onlyServer)(function () {
    return (0, papr_1.schema)({
        _id: papr_1.types.objectId({ required: true }),
        name: papr_1.types.string({ required: true }),
        subdomain: papr_1.types.string({ required: true }),
        createdAt: papr_1.types.date({ required: true }),
        updatedAt: papr_1.types.date({ required: true }),
        enabledFeatures: papr_1.types.array(papr_1.types.enum(Object.values(TenantFeature), { required: true })),
    }, {
        timestamps: true,
    });
});
var getTenant = function () { return (0, isServer_1.onlyServer)(function () { return db_1.default.model("tenants", tenantSchema); }); };
exports.default = getTenant;
