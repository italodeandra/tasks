"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var clsx_1 = __importDefault(require("../../utils/clsx"));
var react_1 = require("react");
var TableHeadContext_1 = __importDefault(require("./TableHeadContext"));
function TableCell(_a) {
    var children = _a.children, className = _a.className, actions = _a.actions, colSpan = _a.colSpan, title = _a.title;
    var isHead = (0, react_1.useContext)(TableHeadContext_1.default).isHead;
    var commonClassName = (0, clsx_1.default)("text-sm first:pl-4 first:sm:pl-6 first:font-medium first:text-zinc-900 dark:first:text-zinc-100 px-3", {
        "py-2 last:pr-4 last:sm:pr-6": !actions,
        "py-0.5 text-right pr-2.5 sm:pr-5": actions,
    });
    if (isHead) {
        return ((0, jsx_runtime_1.jsx)("th", { className: (0, clsx_1.default)(commonClassName, "sticky left-0 bg-zinc-50 py-2 text-left font-semibold text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50", className), colSpan: colSpan, title: title, children: children }));
    }
    return ((0, jsx_runtime_1.jsx)("td", { className: (0, clsx_1.default)(commonClassName, "whitespace-nowrap text-zinc-500 dark:text-zinc-300", className), colSpan: colSpan, title: title, children: children }));
}
exports.default = TableCell;
