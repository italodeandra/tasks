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
var react_markdown_1 = __importDefault(require("react-markdown"));
var remark_gfm_1 = __importDefault(require("remark-gfm"));
var clsx_1 = __importDefault(require("clsx"));
function Markdown(_a) {
    var children = _a.children, className = _a.className;
    return ((0, jsx_runtime_1.jsx)("div", __assign({ className: (0, clsx_1.default)("markdown prose max-w-none dark:prose-invert", className) }, { children: children && ((0, jsx_runtime_1.jsx)(react_markdown_1.default, __assign({ remarkPlugins: [remark_gfm_1.default] }, { children: children }))) })));
}
exports.default = Markdown;
