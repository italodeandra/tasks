"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var Text_1 = __importDefault(require("../Text/Text"));
var Stack_1 = __importDefault(require("../Stack/Stack"));
function TableHeader(_a) {
    var title = _a.title, subtitle = _a.subtitle, children = _a.children;
    return ((0, jsx_runtime_1.jsx)("div", { className: "px-4 md:px-0", children: (0, jsx_runtime_1.jsxs)("div", { className: "sm:flex sm:items-center", children: [(title || subtitle) && ((0, jsx_runtime_1.jsxs)(Stack_1.default, { className: "sm:flex-auto", children: [title && ((0, jsx_runtime_1.jsx)(Text_1.default, { variant: "label", size: "lg", children: title })), subtitle && (0, jsx_runtime_1.jsx)(Text_1.default, { variant: "secondary", children: subtitle })] })), children && ((0, jsx_runtime_1.jsx)("div", { className: "mt-4 sm:mt-0 sm:ml-16 sm:flex-none", children: children }))] }) }));
}
exports.default = TableHeader;
