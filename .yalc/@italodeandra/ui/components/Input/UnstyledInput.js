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
var react_1 = require("react");
var react_2 = require("react");
var clsx_1 = __importDefault(require("clsx"));
function UnstyledInput(_a, ref) {
    var _b, _c;
    var id = _a.id, label = _a.label, className = _a.className, inputClassName = _a.inputClassName, labelClassName = _a.labelClassName, helpTextClassName = _a.helpTextClassName, trailingClassName = _a.trailingClassName, trailingInputClassName = _a.trailingInputClassName, leadingClassName = _a.leadingClassName, leadingInputClassName = _a.leadingInputClassName, helpText = _a.helpText, _d = _a.type, type = _d === void 0 ? "text" : _d, leading = _a.leading, trailing = _a.trailing, select = _a.select, children = _a.children, as = _a.as, innerClassName = _a.innerClassName, props = __rest(_a, ["id", "label", "className", "inputClassName", "labelClassName", "helpTextClassName", "trailingClassName", "trailingInputClassName", "leadingClassName", "leadingInputClassName", "helpText", "type", "leading", "trailing", "select", "children", "as", "innerClassName"]);
    var innerId = (0, react_2.useId)();
    id = id || innerId;
    var Component = as || (select ? "select" : "input");
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: className }, { children: [label && ((0, jsx_runtime_1.jsx)("label", __assign({ htmlFor: id, className: labelClassName }, { children: label }))), (0, jsx_runtime_1.jsxs)("div", __assign({ style: { position: "relative" }, className: innerClassName }, { children: [leading && (0, jsx_runtime_1.jsx)("div", __assign({ className: leadingClassName }, { children: leading })), (0, jsx_runtime_1.jsx)(Component
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    , __assign({}, props, { className: (0, clsx_1.default)(inputClassName, leadingInputClassName && (_b = {},
                            _b[leadingInputClassName] = !!leading,
                            _b), trailingInputClassName && (_c = {},
                            _c[trailingInputClassName] = !!trailing,
                            _c)), id: id, type: type, ref: ref }, { children: select ? children : undefined })), trailing && (0, jsx_runtime_1.jsx)("div", __assign({ className: trailingClassName }, { children: trailing }))] })), helpText && (0, jsx_runtime_1.jsx)("div", __assign({ className: helpTextClassName }, { children: helpText }))] })));
}
exports.default = (0, react_1.forwardRef)(UnstyledInput);
