"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
var isBrowser_1 = require("../utils/isBrowser");
var consoleLog = console.log;
if (isBrowser_1.isBrowser && process.env.NODE_ENV !== "development") {
    console.log = function () {
        return consoleLog("Suppressed log in production");
    };
}
