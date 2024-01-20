"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var clsx_1 = __importDefault(require("../../utils/clsx"));
function InputWrapper(_a) {
    var children = _a.children, className = _a.className, label = _a.label, id = _a.id, helpText = _a.helpText, error = _a.error;
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, clsx_1.default)("ui-input-wrapper", className), "data-error": error ? "" : undefined, children: [label && ((0, jsx_runtime_1.jsx)("label", { htmlFor: id, className: "ui-input-wrapper-label", children: label })), children, helpText && (0, jsx_runtime_1.jsx)("div", { className: "ui-input-wrapper-help-text", children: helpText })] }));
}
exports.default = InputWrapper;
