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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var prism_react_renderer_1 = __importStar(require("prism-react-renderer"));
var clsx_1 = __importDefault(require("clsx"));
var CopyButton_1 = __importDefault(require("../CopyButton"));
function Code(_a) {
    var children = _a.children, language = _a.language, className = _a.className, copy = _a.copy, copyText = _a.copyText, copiedText = _a.copiedText, theme = _a.theme;
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: (0, clsx_1.default)("group relative", className, {
            dark: !theme,
        }) }, { children: [(0, jsx_runtime_1.jsx)("div", __assign({ className: "prose max-w-none" }, { children: (0, jsx_runtime_1.jsx)(prism_react_renderer_1.default, __assign({}, prism_react_renderer_1.defaultProps, { code: children.trimEnd(), language: language, theme: theme }, { children: function (_a) {
                        var className = _a.className, style = _a.style, tokens = _a.tokens, getTokenProps = _a.getTokenProps;
                        return ((0, jsx_runtime_1.jsx)("pre", __assign({ className: className, style: style }, { children: (0, jsx_runtime_1.jsx)("code", { children: tokens.map(function (line, lineIndex) { return ((0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: [line
                                            .filter(function (token) { return !token.empty; })
                                            .map(function (token, tokenIndex) { return ((0, jsx_runtime_1.jsx)("span", __assign({}, getTokenProps({ token: token })), tokenIndex)); }), "\n"] }, lineIndex)); }) }) })));
                    } })) })), copy && ((0, jsx_runtime_1.jsx)(CopyButton_1.default, { text: children, copyText: copyText, copiedText: copiedText }))] })));
}
exports.default = Code;
