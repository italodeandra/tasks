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
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var TableHeadContext_1 = __importDefault(require("./TableHeadContext"));
function TableBody(_a) {
    var children = _a.children;
    return ((0, jsx_runtime_1.jsx)(TableHeadContext_1.default.Provider, __assign({ value: (0, react_1.useMemo)(function () { return ({ isHead: false, sticky: false }); }, []) }, { children: (0, jsx_runtime_1.jsx)("tbody", __assign({ className: "divide-y divide-zinc-200 bg-white dark:divide-zinc-700 dark:bg-zinc-800" }, { children: children })) })));
}
exports.default = TableBody;
