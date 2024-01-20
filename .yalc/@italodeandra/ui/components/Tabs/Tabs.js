"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tab = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var clsx_1 = __importDefault(require("../../utils/clsx"));
function Tabs(_a) {
    var children = _a.children, className = _a.className;
    return (0, jsx_runtime_1.jsx)("div", { className: (0, clsx_1.default)("ui-tabs", className), children: children });
}
exports.default = Tabs;
function Tab(_a) {
    var children = _a.children, selected = _a.selected, onClick = _a.onClick;
    return ((0, jsx_runtime_1.jsx)("button", { className: "ui-tabs-tab", onClick: onClick, "data-selected": selected ? "" : undefined, children: children }));
}
exports.Tab = Tab;
