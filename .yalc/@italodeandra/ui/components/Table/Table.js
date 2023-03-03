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
var clsx_1 = __importDefault(require("clsx"));
var TableActionButton_1 = __importDefault(require("./TableActionButton"));
var TableBody_1 = __importDefault(require("./TableBody"));
var TableCell_1 = __importDefault(require("./TableCell"));
var TableHead_1 = __importDefault(require("./TableHead"));
var TableHeader_1 = __importDefault(require("./TableHeader"));
var TableRow_1 = __importDefault(require("./TableRow"));
var TableFooter_1 = __importDefault(require("./TableFooter"));
var TableFooterWithPagination_1 = __importDefault(require("./TableFooterWithPagination"));
function Table(_a) {
    var children = _a.children, className = _a.className, dense = _a.dense, hideBorder = _a.hideBorder;
    return ((0, jsx_runtime_1.jsx)("div", __assign({ className: (0, clsx_1.default)("overflow-x-auto", {
            "dense group": dense,
            "md:-mx-1 md:px-1": !hideBorder,
        }) }, { children: (0, jsx_runtime_1.jsx)("div", __assign({ className: "inline-block min-w-full py-2 align-middle " }, { children: (0, jsx_runtime_1.jsx)("div", __assign({ className: (0, clsx_1.default)("overflow-hidden", {
                    "shadow ring-1 ring-black/5 dark:ring-white/10 md:rounded-lg": !hideBorder,
                }) }, { children: (0, jsx_runtime_1.jsx)("table", __assign({ className: (0, clsx_1.default)("min-w-full divide-y divide-zinc-300 dark:divide-zinc-600", className) }, { children: children })) })) })) })));
}
exports.default = Table;
Table.Row = TableRow_1.default;
Table.Head = TableHead_1.default;
Table.Body = TableBody_1.default;
Table.Cell = TableCell_1.default;
Table.ActionButton = TableActionButton_1.default;
Table.Header = TableHeader_1.default;
Table.Footer = TableFooter_1.default;
Table.FooterWithPagination = TableFooterWithPagination_1.default;
