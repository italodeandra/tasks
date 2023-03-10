"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cookies_next_1 = require("cookies-next");
var valtio_1 = require("valtio");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createStateHydration(cookieName, state) {
    (0, valtio_1.subscribe)(state, function () {
        (0, cookies_next_1.setCookie)(cookieName, (0, valtio_1.snapshot)(state));
    });
    return function hydrate(cookies) {
        if (cookies === null || cookies === void 0 ? void 0 : cookies[cookieName]) {
            Object.assign(state, JSON.parse(cookies[cookieName]));
        }
    };
}
exports.default = createStateHydration;
