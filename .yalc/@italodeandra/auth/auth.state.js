"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuthSnapshot = exports.hydrateAuthState = exports.clearAuthState = void 0;
var valtio_1 = require("valtio");
var createStateHydration_1 = __importDefault(require("./utils/createStateHydration"));
var cookies_next_1 = require("cookies-next");
var authState = (0, valtio_1.proxy)({
    token: null,
    previousToken: null,
});
function clearAuthState() {
    authState.token = null;
    authState.previousToken = null;
    (0, cookies_next_1.deleteCookie)("auth", { path: "/" });
}
exports.clearAuthState = clearAuthState;
exports.hydrateAuthState = (0, createStateHydration_1.default)("auth", authState);
var useAuthSnapshot = function () { return (0, valtio_1.useSnapshot)(authState); };
exports.useAuthSnapshot = useAuthSnapshot;
exports.default = authState;
