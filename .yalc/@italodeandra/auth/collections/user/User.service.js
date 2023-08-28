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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateUserType = exports.userTypeTranslations = exports.setUserPassword = exports.getFullUserFromCookies = exports.getUserFromCookies = exports.getAuthCookieToken = exports.createUser = exports.convertToUserType = exports.checkUserType = exports.readResetPasswordToken = exports.generateResetPasswordToken = exports.readToken = exports.generateToken = exports.checkUserPassword = exports.generateSalt = exports.hashPassword = void 0;
var crypto_1 = __importDefault(require("crypto"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var User_1 = __importStar(require("./User"));
var isomorphicObjectId_1 = __importDefault(require("@italodeandra/next/utils/isomorphicObjectId"));
var cookies_next_1 = require("cookies-next");
var JWT_SECRET = process.env.JWT_SECRET;
function hashPassword(plainPassword, salt) {
    return crypto_1.default
        .pbkdf2Sync(plainPassword, salt, 1000, 64, "sha512")
        .toString("hex");
}
exports.hashPassword = hashPassword;
function generateSalt() {
    return crypto_1.default.randomBytes(16).toString("hex");
}
exports.generateSalt = generateSalt;
function checkUserPassword(user, plainPassword) {
    var passwordToCheck = hashPassword(plainPassword, user.passwordSalt);
    return user.password === passwordToCheck;
}
exports.checkUserPassword = checkUserPassword;
function generateToken(userId) {
    if (!JWT_SECRET) {
        throw Error("Missing JWT_SECRET env var");
    }
    return jsonwebtoken_1.default.sign({ id: userId }, JWT_SECRET, { expiresIn: "30d" });
}
exports.generateToken = generateToken;
function readToken(token) {
    if (!JWT_SECRET) {
        throw Error("Missing JWT_SECRET env var");
    }
    var payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
    return (0, isomorphicObjectId_1.default)(payload.id);
}
exports.readToken = readToken;
function generateResetPasswordToken(userEmail) {
    if (!JWT_SECRET) {
        throw Error("Missing JWT_SECRET env var");
    }
    return jsonwebtoken_1.default.sign({ email: userEmail }, JWT_SECRET, { expiresIn: "10m" });
}
exports.generateResetPasswordToken = generateResetPasswordToken;
function readResetPasswordToken(token) {
    if (!JWT_SECRET) {
        throw Error("Missing JWT_SECRET env var");
    }
    var payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
    return payload.email;
}
exports.readResetPasswordToken = readResetPasswordToken;
function checkUserType(user, typesToCheck) {
    return !!(user === null || user === void 0 ? void 0 : user.type) && typesToCheck.includes(user.type);
}
exports.checkUserType = checkUserType;
function convertToUserType(userType) {
    return User_1.UserType[userType];
}
exports.convertToUserType = convertToUserType;
function createUser(doc) {
    return __awaiter(this, void 0, void 0, function () {
        var User, passwordSalt;
        return __generator(this, function (_a) {
            User = (0, User_1.default)();
            passwordSalt = generateSalt();
            return [2 /*return*/, User.insertOne(__assign(__assign({}, doc), { email: doc.email.toLowerCase().trim(), password: hashPassword(doc.password, passwordSalt), passwordSalt: passwordSalt }))];
        });
    });
}
exports.createUser = createUser;
function getAuthCookieToken(req, res) {
    var cookies = (0, cookies_next_1.getCookies)({ req: req, res: res });
    try {
        return cookies.auth ? JSON.parse(cookies.auth).token : null;
    }
    catch (e) {
        return null;
    }
}
exports.getAuthCookieToken = getAuthCookieToken;
function getUserFromCookies(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var User, token, userId, user, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    User = (0, User_1.default)();
                    token = getAuthCookieToken(req, res);
                    if (!token) {
                        return [2 /*return*/, null];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    userId = readToken(token);
                    return [4 /*yield*/, User.findOne({ _id: userId }, { projection: { email: 1, type: 1, name: 1 } })];
                case 2:
                    user = _a.sent();
                    if (!user) {
                        (0, cookies_next_1.deleteCookie)("auth", { req: req, res: res });
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, user];
                case 3:
                    e_1 = _a.sent();
                    console.error(e_1);
                    (0, cookies_next_1.deleteCookie)("auth", { req: req, res: res });
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getUserFromCookies = getUserFromCookies;
function getFullUserFromCookies(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var User, token, userId, user, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    User = (0, User_1.default)();
                    token = getAuthCookieToken(req, res);
                    if (!token) {
                        return [2 /*return*/, null];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    userId = readToken(token);
                    return [4 /*yield*/, User.findOne({ _id: userId }, {
                            projection: {
                                email: 1,
                                type: 1,
                                name: 1,
                                phoneNumber: 1,
                                customData: 1,
                            },
                        })];
                case 2:
                    user = _a.sent();
                    if (!user) {
                        (0, cookies_next_1.deleteCookie)("auth", { req: req, res: res });
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, user];
                case 3:
                    e_2 = _a.sent();
                    (0, cookies_next_1.deleteCookie)("auth", { req: req, res: res });
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getFullUserFromCookies = getFullUserFromCookies;
function setUserPassword(userId, plainPassword) {
    return __awaiter(this, void 0, void 0, function () {
        var User, passwordSalt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    User = (0, User_1.default)();
                    passwordSalt = generateSalt();
                    return [4 /*yield*/, User.updateOne({
                            _id: userId,
                        }, {
                            $set: {
                                password: hashPassword(plainPassword, passwordSalt),
                                passwordSalt: passwordSalt,
                            },
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.setUserPassword = setUserPassword;
exports.userTypeTranslations = (_a = {},
    _a[User_1.UserType.ADMIN] = "Administrator",
    _a[User_1.UserType.NORMAL] = "Normal",
    _a);
function translateUserType(userType) {
    return exports.userTypeTranslations[userType.toString()];
}
exports.translateUserType = translateUserType;
