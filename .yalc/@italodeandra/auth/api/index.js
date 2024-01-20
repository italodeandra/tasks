"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var getUser_1 = __importDefault(require("./getUser"));
var signIn_1 = __importDefault(require("./signIn"));
var signUp_1 = __importDefault(require("./signUp"));
var resetPassword_1 = __importDefault(require("./resetPassword"));
var requestPasswordReset_1 = __importDefault(require("./requestPasswordReset"));
var apiHandlerWrapper_1 = require("@italodeandra/next/api/apiHandlerWrapper");
var lodash_1 = require("lodash");
var list_1 = __importDefault(require("./panel/user/list"));
var get_1 = __importDefault(require("./panel/user/get"));
var create_1 = __importDefault(require("./panel/user/create"));
var update_1 = __importDefault(require("./panel/user/update"));
var getFullUser_1 = __importDefault(require("./getFullUser"));
var impersonate_1 = __importDefault(require("./panel/user/impersonate"));
var stop_impersonate_1 = __importDefault(require("./panel/user/stop-impersonate"));
function Auth(config) {
    config.fallbackLocale = config.fallbackLocale || "en-US";
    config.intl = __assign({ "en-US": {
            "Reset your password": "Reset your password",
            "To reset your password click the link below": "To reset your password click the link below",
            "Click here": "Click here",
            "If you didn't request to reset your password, please ignore this email": "If you didn't request to reset your password, please ignore this email",
            "Kind regards": "Kind regards",
            "or copy and paste the following link on your browser": "or copy and paste the following link on your browser",
            "We received a request to reset your password": "We received a request to reset your password",
        } }, config.intl);
    return (0, apiHandlerWrapper_1.apiHandlerWrapper)(function (args, req, res) {
        var route = req.query.auth;
        return (0, lodash_1.get)({
            getUser: getUser_1.default,
            getFullUser: getFullUser_1.default,
            signIn: signIn_1.default,
            signUp: signUp_1.default,
            resetPassword: resetPassword_1.default,
            requestPasswordReset: requestPasswordReset_1.default,
            panel: {
                user: {
                    list: list_1.default,
                    get: get_1.default,
                    create: create_1.default,
                    update: update_1.default,
                    impersonate: impersonate_1.default,
                    stopImpersonate: stop_impersonate_1.default,
                },
            },
        }, route.join(".")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        )(args, req, res, config);
    });
}
exports.default = Auth;
