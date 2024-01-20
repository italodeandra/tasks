"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var TableHeadContext_1 = __importDefault(require("./TableHeadContext"));
function TableHead(_a) {
    var children = _a.children;
    return ((0, jsx_runtime_1.jsx)(TableHeadContext_1.default.Provider, { value: (0, react_1.useMemo)(function () { return ({ isHead: true }); }, []), children: (0, jsx_runtime_1.jsx)("thead", { className: "sticky top-0 bg-zinc-50 dark:bg-zinc-900", children: children }) }));
}
exports.default = TableHead;
