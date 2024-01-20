"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var TableHeadContext_1 = __importDefault(require("./TableHeadContext"));
function TableBody(_a) {
    var children = _a.children;
    return ((0, jsx_runtime_1.jsx)(TableHeadContext_1.default.Provider, { value: (0, react_1.useMemo)(function () { return ({ isHead: false, sticky: false }); }, []), children: (0, jsx_runtime_1.jsx)("tbody", { className: "divide-y divide-zinc-200 bg-white dark:divide-zinc-700 dark:bg-zinc-800 [&_tr:last-of-type]:!border-b [&_tr:last-of-type]:border-zinc-200 [&_tr:last-of-type]:dark:border-zinc-700", children: children }) }));
}
exports.default = TableBody;
