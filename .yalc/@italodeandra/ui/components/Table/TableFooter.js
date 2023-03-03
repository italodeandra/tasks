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
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
function TableFooter(_a) {
    var children = _a.children;
    return ((0, jsx_runtime_1.jsx)("div", __assign({ className: "flex items-center justify-between border border-x-0 border-gray-200 bg-white p-3 dark:border-white/10 dark:bg-zinc-900 sm:border-x sm:px-5 md:rounded-lg" }, { children: children })));
}
exports.default = TableFooter;
