"use strict";
/* eslint-disable @typescript-eslint/ban-ts-comment */
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
exports.prepareConnectToDb = exports.connectToDb = void 0;
var papr_1 = __importDefault(require("papr"));
var mongodb_1 = require("mongodb");
var isServer_1 = require("./utils/isServer");
var wait_1 = __importDefault(require("./utils/wait"));
/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// @ts-ignore
var cached = global.papr;
if (!cached) {
    // @ts-ignore
    cached = global.papr = (0, isServer_1.onlyServer)(function () { return ({
        papr: new papr_1.default(),
        promise: null,
    }); }, {});
}
exports.connectToDb = prepareConnectToDb();
function prepareConnectToDb(args) {
    var _this = this;
    var _a = args || {}, seeds = _a.seeds, migrations = _a.migrations, uri = _a.uri;
    return function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (cached.promise) {
                        return [2 /*return*/, cached.promise];
                    }
                    cached.promise = new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, MONGODB_URI, APP_ENV, MONGODB_MEMORY_SERVER_DBNAME, MongoMemoryServer, mongod, connection;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = process.env, MONGODB_URI = _a.MONGODB_URI, APP_ENV = _a.APP_ENV, MONGODB_MEMORY_SERVER_DBNAME = _a.MONGODB_MEMORY_SERVER_DBNAME;
                                    uri = uri || MONGODB_URI;
                                    if (!(!uri && APP_ENV !== "production")) return [3 /*break*/, 3];
                                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("mongodb-memory-server")); })];
                                case 1:
                                    MongoMemoryServer = (_b.sent()).MongoMemoryServer;
                                    return [4 /*yield*/, MongoMemoryServer.create(APP_ENV !== "test"
                                            ? {
                                                instance: {
                                                    port: 5432,
                                                    dbName: MONGODB_MEMORY_SERVER_DBNAME,
                                                },
                                            }
                                            : undefined)];
                                case 2:
                                    mongod = _b.sent();
                                    uri = mongod.getUri() + MONGODB_MEMORY_SERVER_DBNAME;
                                    console.info("[MongoDB] Started a MongoDB Memory Server at \"".concat(uri, "\""));
                                    _b.label = 3;
                                case 3:
                                    if (!uri) {
                                        throw Error("[MongoDB] Missing URI");
                                    }
                                    return [4 /*yield*/, mongodb_1.MongoClient.connect(uri)];
                                case 4:
                                    connection = _b.sent();
                                    console.info("[MongoDB] Connected to \"".concat(uri, "\""));
                                    cached.papr.initialize(connection.db());
                                    return [4 /*yield*/, (0, wait_1.default)("2s")];
                                case 5:
                                    _b.sent();
                                    console.info("[MongoDB] Initialized");
                                    if (!migrations) return [3 /*break*/, 7];
                                    return [4 /*yield*/, Promise.all(migrations.map(function (migration) { return migration(cached.papr.db, cached.papr); }))];
                                case 6:
                                    _b.sent();
                                    console.info("[MongoDB] Migrations completed");
                                    _b.label = 7;
                                case 7:
                                    if (!seeds) return [3 /*break*/, 9];
                                    return [4 /*yield*/, Promise.all(seeds.map(function (seed) { return seed(cached.papr.db, cached.papr); }))];
                                case 8:
                                    _b.sent();
                                    console.info("[MongoDB] Seeds completed");
                                    _b.label = 9;
                                case 9:
                                    resolve(cached.papr);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    _a = cached;
                    return [4 /*yield*/, cached.promise];
                case 1:
                    _a.papr = _b.sent();
                    return [2 /*return*/, cached.papr];
            }
        });
    }); };
}
exports.prepareConnectToDb = prepareConnectToDb;
exports.default = cached.papr;
