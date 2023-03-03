"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuthResetPassword = void 0;
var User_1 = __importDefault(require("../collections/user/User"));
var User_service_1 = require("../collections/user/User.service");
var react_query_1 = require("@tanstack/react-query");
var jsonwebtoken_1 = require("jsonwebtoken");
var errors_1 = require("@italodeandra/next/api/errors");
var apiHandlerWrapper_1 = require("@italodeandra/next/api/apiHandlerWrapper");
function resetPasswordHandler(args, _req, res, _a) {
    var connectToDb = _a.connectToDb;
    return __awaiter(this, void 0, void 0, function () {
        var email, user, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!args.token || !args.newPassword) {
                        throw errors_1.badRequest;
                    }
                    return [4 /*yield*/, connectToDb()];
                case 1:
                    _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 5, , 6]);
                    email = (0, User_service_1.readResetPasswordToken)(args.token);
                    return [4 /*yield*/, User_1.default.findOne({
                            email: email,
                        }, {
                            projection: {},
                        })];
                case 3:
                    user = _b.sent();
                    if (!user) {
                        // noinspection ExceptionCaughtLocallyJS
                        throw errors_1.badRequest;
                    }
                    return [4 /*yield*/, (0, User_service_1.setUserPassword)(user._id, args.newPassword)];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    e_1 = _b.sent();
                    if (e_1 instanceof jsonwebtoken_1.TokenExpiredError) {
                        // noinspection JSVoidFunctionReturnValueUsed
                        throw (0, errors_1.badRequest)(res, { status: "TokenExpired" });
                    }
                    throw e_1;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.default = resetPasswordHandler;
var mutationKey = "/api/auth/resetPassword";
var useAuthResetPassword = function (options) {
    return (0, react_query_1.useMutation)([mutationKey], (0, apiHandlerWrapper_1.mutationFnWrapper)(mutationKey), options);
};
exports.useAuthResetPassword = useAuthResetPassword;
