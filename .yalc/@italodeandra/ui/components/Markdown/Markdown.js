"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var clsx_1 = __importDefault(require("../../utils/clsx"));
var showdown_1 = __importDefault(require("showdown"));
function Markdown(_a) {
    var children = _a.children, className = _a.className, options = _a.options;
    var converter = (0, react_1.useMemo)(function () { return new showdown_1.default.Converter(options); }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(options)]);
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, clsx_1.default)("prose prose-zinc dark:prose-invert", className), dangerouslySetInnerHTML: children
            ? {
                __html: converter.makeHtml(children),
            }
            : undefined }));
}
exports.default = Markdown;
