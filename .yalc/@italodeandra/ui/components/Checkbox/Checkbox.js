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
var Text_1 = require("../Text");
var clsx_1 = __importDefault(require("../../utils/clsx"));
var defaultLabelClassName = Text_1.defaultTextStyles.variant.label;
var defaultDescriptionClassName = Text_1.defaultTextStyles.variant.secondary;
var defaultInputClassName = "h-4 w-4 border-zinc-300 dark:checked:bg-primary-500 dark:checked:border-primary-500 dark:border-zinc-600 text-primary-600 ring-0 transition-colors dark:bg-zinc-900 hover:bg-zinc-100 focus:outline-none focus:ring-primary-500 focus-visible:ring-2 ring-offset-zinc-100 dark:ring-offset-zinc-900";
function Checkbox(_a, ref) {
    var id = _a.id, label = _a.label, description = _a.description, className = _a.className, labelClassName = _a.labelClassName, descriptionClassName = _a.descriptionClassName, inputClassName = _a.inputClassName, labelOuterClassName = _a.labelOuterClassName, _b = _a.type, type = _b === void 0 ? "checkbox" : _b, props = __rest(_a, ["id", "label", "description", "className", "labelClassName", "descriptionClassName", "inputClassName", "labelOuterClassName", "type"]);
    var defaultInputId = (0, react_1.useId)();
    var descriptionId = (0, react_1.useId)();
    id = id || defaultInputId;
    labelClassName = labelClassName
        ? "".concat(defaultLabelClassName, " ").concat(labelClassName)
        : defaultLabelClassName;
    descriptionClassName = descriptionClassName
        ? "".concat(defaultDescriptionClassName, " ").concat(descriptionClassName)
        : defaultDescriptionClassName;
    inputClassName = (0, clsx_1.default)(defaultInputClassName, inputClassName, type === "radio" ? "rounded-full" : "rounded");
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, clsx_1.default)("relative flex items-start", className), children: [(0, jsx_runtime_1.jsx)("div", { className: "flex h-5 items-center", children: (0, jsx_runtime_1.jsx)("input", __assign({}, props, { id: id, "aria-describedby": descriptionId, type: type, className: inputClassName, ref: ref })) }), (label || description) && ((0, jsx_runtime_1.jsxs)("div", { className: (0, clsx_1.default)("ml-3 text-sm", labelOuterClassName), children: [label && ((0, jsx_runtime_1.jsx)("label", { htmlFor: id, className: labelClassName, children: label })), description && ((0, jsx_runtime_1.jsx)("p", { id: descriptionId, className: descriptionClassName, children: description }))] }))] }));
}
exports.default = (0, react_1.forwardRef)(Checkbox);
