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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var clsx_1 = __importDefault(require("../../utils/clsx"));
var react_1 = require("react");
var Button_1 = __importDefault(require("../Button/Button"));
var Tooltip_1 = __importDefault(require("../Tooltip/Tooltip"));
function TableActionButton(_a) {
    var _b;
    var children = _a.children, className = _a.className, title = _a.title, onClick = _a.onClick, props = __rest(_a, ["children", "className", "title", "onClick"]);
    var handleClick = function (e) {
        e.stopPropagation();
        onClick === null || onClick === void 0 ? void 0 : onClick(e);
    };
    var button = ((0, jsx_runtime_1.jsx)(Button_1.default, __assign({ icon: true, variant: "text", className: (0, clsx_1.default)("!p-1", className), onClick: handleClick }, props, { children: (0, react_1.cloneElement)(children, {
            className: (0, clsx_1.default)("!h-[20px] !w-[20px]", (_b = children === null || children === void 0 ? void 0 : children.props) === null || _b === void 0 ? void 0 : _b.className),
        }) })));
    if (title) {
        return (0, jsx_runtime_1.jsx)(Tooltip_1.default, { content: title, children: button });
    }
    return button;
}
exports.default = TableActionButton;
