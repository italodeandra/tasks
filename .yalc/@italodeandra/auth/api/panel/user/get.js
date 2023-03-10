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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.remove_authPanelUserGet = exports.invalidate_authPanelUserGet = exports.prefetch_authPanelUserGet = exports.useAuthPanelUserGet = void 0;
var react_query_1 = require("@tanstack/react-query");
var errors_1 = require("@italodeandra/next/api/errors");
var User_1 = __importStar(require("../../../collections/user/User"));
var User_service_1 = require("../../../collections/user/User.service");
var isomorphicObjectId_1 = __importDefault(require("@italodeandra/next/utils/isomorphicObjectId"));
var apiHandlerWrapper_1 = require("@italodeandra/next/api/apiHandlerWrapper");
function panelUserGetHandler(args, req, res, _a) {
    var connectDb = _a.connectDb;
    return __awaiter(this, void 0, void 0, function () {
        var signedInUser, user;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!args._id) {
                        throw errors_1.badRequest;
                    }
                    return [4 /*yield*/, connectDb()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, User_service_1.getUserFromCookies)(req, res)];
                case 2:
                    signedInUser = _b.sent();
                    if (!(0, User_service_1.checkUserType)(signedInUser, [User_1.UserType.ADMIN])) {
                        throw errors_1.unauthorized;
                    }
                    return [4 /*yield*/, User_1.default.findOne({
                            _id: (0, isomorphicObjectId_1.default)(args._id),
                        }, {
                            projection: {
                                email: 1,
                                name: 1,
                                type: 1,
                            },
                        })];
                case 3:
                    user = _b.sent();
                    if (!user) {
                        throw errors_1.notFound;
                    }
                    return [2 /*return*/, user];
            }
        });
    });
}
exports.default = panelUserGetHandler;
var queryKey = "/api/auth/panel/user/get";
var useAuthPanelUserGet = function (args, options) {
    return (0, react_query_1.useQuery)([queryKey, args === null || args === void 0 ? void 0 : args._id], (0, apiHandlerWrapper_1.queryFnWrapper)(queryKey, args), __assign(__assign({}, options), { enabled: !!(args === null || args === void 0 ? void 0 : args._id) }));
};
exports.useAuthPanelUserGet = useAuthPanelUserGet;
var prefetch_authPanelUserGet = function (queryClient) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return queryClient.prefetchQuery([queryKey, args[0]._id], function () {
        return panelUserGetHandler.apply(void 0, args);
    });
};
exports.prefetch_authPanelUserGet = prefetch_authPanelUserGet;
var invalidate_authPanelUserGet = function (queryClient, args) { return queryClient.invalidateQueries([queryKey, args._id]); };
exports.invalidate_authPanelUserGet = invalidate_authPanelUserGet;
var remove_authPanelUserGet = function (queryClient, args) { return queryClient.removeQueries([queryKey, args._id]); };
exports.remove_authPanelUserGet = remove_authPanelUserGet;
