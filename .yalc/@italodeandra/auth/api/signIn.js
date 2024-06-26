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
exports.useAuthSignIn = void 0;
var User_1 = __importDefault(require("../collections/user/User"));
var User_service_1 = require("../collections/user/User.service");
var ms_1 = __importDefault(require("ms"));
var react_query_1 = require("@tanstack/react-query");
var errors_1 = require("@italodeandra/next/api/errors");
var lodash_1 = require("lodash");
var apiHandlerWrapper_1 = require("@italodeandra/next/api/apiHandlerWrapper");
var cookies_next_1 = require("cookies-next");
var Tenant_service_1 = require("../collections/tenant/Tenant.service");
function signInHandler(args, req, res, _a) {
    var _b;
    var connectDb = _a.connectDb, multitenantMode = _a.multitenantMode;
    return __awaiter(this, void 0, void 0, function () {
        var User, tenantId, _c, email, user, token;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!args.email || !args.password) {
                        throw errors_1.badRequest;
                    }
                    return [4 /*yield*/, connectDb()];
                case 1:
                    _d.sent();
                    User = (0, User_1.default)();
                    if (!multitenantMode) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, Tenant_service_1.getReqTenant)(req)];
                case 2:
                    _c = (_b = (_d.sent())) === null || _b === void 0 ? void 0 : _b._id;
                    return [3 /*break*/, 4];
                case 3:
                    _c = undefined;
                    _d.label = 4;
                case 4:
                    tenantId = _c;
                    email = args.email.toLowerCase().trim();
                    return [4 /*yield*/, User.findOne(__assign(__assign({}, (multitenantMode ? { tenantId: tenantId } : {})), { email: email }), {
                            projection: {
                                email: 1,
                                type: 1,
                                password: 1,
                                passwordSalt: 1,
                            },
                        })];
                case 5:
                    user = _d.sent();
                    if (!user) {
                        console.error("User not found. Tenant ID: \"".concat(tenantId, "\". Email: \"").concat(email, "\"."));
                        throw (0, errors_1.unauthorized)(res, { message: "User not found" });
                    }
                    if (!(0, User_service_1.checkUserPassword)(user, args.password)) {
                        console.error("Wrong password.");
                        throw (0, errors_1.unauthorized)(res, { message: "User not found" });
                    }
                    token = (0, User_service_1.generateToken)(user._id);
                    (0, cookies_next_1.setCookie)("auth", { token: token }, {
                        req: req,
                        res: res,
                        maxAge: (0, ms_1.default)("30d"),
                        path: "/",
                    });
                    return [2 /*return*/, (0, lodash_1.pick)(user, ["_id", "email", "type"])];
            }
        });
    });
}
exports.default = signInHandler;
var mutationKey = "/api/auth/signIn";
var useAuthSignIn = function (options) {
    return (0, react_query_1.useMutation)([mutationKey], (0, apiHandlerWrapper_1.mutationFnWrapper)(mutationKey), options);
};
exports.useAuthSignIn = useAuthSignIn;
