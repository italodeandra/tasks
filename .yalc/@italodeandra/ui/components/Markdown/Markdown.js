"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_markdown_1 = __importDefault(require("react-markdown"));
var remark_gfm_1 = __importDefault(require("remark-gfm"));
var clsx_1 = __importDefault(require("../../utils/clsx"));
function Markdown(_a) {
    var children = _a.children, className = _a.className;
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, clsx_1.default)("markdown prose max-w-none dark:prose-invert", className), children: children && ((0, jsx_runtime_1.jsx)(react_markdown_1.default, { remarkPlugins: [remark_gfm_1.default], children: children })) }));
}
exports.default = Markdown;
