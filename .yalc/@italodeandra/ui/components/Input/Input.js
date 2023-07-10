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
exports.defaultTrailingInputClassName = exports.defaultLeadingInputClassName = exports.defaultLeadingClassName = exports.defaultTrailingClassName = exports.defaultHelpTextClassName = exports.defaultInputClassName = exports.defaultInputClassNameUncolored = exports.defaultLabelClassName = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var UnstyledInput_1 = __importDefault(require("../Input/UnstyledInput"));
var Text_1 = require("../Text");
var solid_1 = require("@heroicons/react/20/solid");
var InputIcon_1 = __importDefault(require("./InputIcon"));
var react_1 = require("react");
var clsx_1 = __importDefault(require("clsx"));
exports.defaultLabelClassName = "block ".concat(Text_1.defaultTextStyles.variant.label, " mb-1");
exports.defaultInputClassNameUncolored = "block w-full rounded-md shadow-sm sm:text-sm disabled:cursor-not-allowed dark:bg-zinc-800";
exports.defaultInputClassName = "".concat(exports.defaultInputClassNameUncolored, " border-gray-300 dark:border-zinc-700 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-primary-500 disabled:border-gray-200 dark:disabled:border-zinc-800 disabled:bg-gray-50 dark:disabled:bg-zinc-900/90 disabled:text-gray-500");
exports.defaultHelpTextClassName = "mt-2 ".concat(Text_1.defaultTextStyles.variant.secondary);
exports.defaultTrailingClassName = "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 text-sm";
exports.defaultLeadingClassName = "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500 text-sm";
exports.defaultLeadingInputClassName = "pl-10";
exports.defaultTrailingInputClassName = "pr-10";
function Input(_a, ref) {
    var error = _a.error, trailing = _a.trailing, labelClassName = _a.labelClassName, inputClassName = _a.inputClassName, helpTextClassName = _a.helpTextClassName, trailingClassName = _a.trailingClassName, leadingClassName = _a.leadingClassName, leadingInputClassName = _a.leadingInputClassName, trailingInputClassName = _a.trailingInputClassName, required = _a.required, label = _a.label, loading = _a.loading, readOnly = _a.readOnly, props = __rest(_a, ["error", "trailing", "labelClassName", "inputClassName", "helpTextClassName", "trailingClassName", "leadingClassName", "leadingInputClassName", "trailingInputClassName", "required", "label", "loading", "readOnly"]);
    trailing =
        trailing ||
            (error ? ((0, jsx_runtime_1.jsx)(InputIcon_1.default, __assign({ className: "text-error-500" }, { children: (0, jsx_runtime_1.jsx)(solid_1.ExclamationCircleIcon, { "aria-hidden": "true" }) }))) : undefined);
    labelClassName = (0, clsx_1.default)(exports.defaultLabelClassName, labelClassName);
    inputClassName = (0, clsx_1.default)(error ? exports.defaultInputClassNameUncolored : exports.defaultInputClassName, inputClassName, {
        "animate-pulse": loading,
    });
    helpTextClassName = (0, clsx_1.default)(exports.defaultHelpTextClassName, helpTextClassName);
    trailingClassName = (0, clsx_1.default)(exports.defaultTrailingClassName, trailingClassName);
    leadingClassName = (0, clsx_1.default)(exports.defaultLeadingClassName, leadingClassName);
    leadingInputClassName = (0, clsx_1.default)(exports.defaultLeadingInputClassName, leadingInputClassName);
    trailingInputClassName = (0, clsx_1.default)(exports.defaultTrailingInputClassName, trailingInputClassName);
    if (error) {
        inputClassName = "".concat(inputClassName, " border-error-300 dark:border-error-500 text-error-900 dark:text-error-500 placeholder-error-300 focus:border-error-500 dark:focus:border-error-500 focus:ring-error-500");
        helpTextClassName = "".concat(helpTextClassName, " !text-error-600 dark:!text-error-500");
    }
    if (readOnly) {
        inputClassName = "".concat(inputClassName, " border-dashed");
    }
    if (label && required) {
        label = ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [label, " ", (0, jsx_runtime_1.jsx)("span", __assign({ className: "text-red-500" }, { children: "*" }))] }));
    }
    return ((0, jsx_runtime_1.jsx)(UnstyledInput_1.default
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    , __assign({}, props, { trailing: trailing, labelClassName: labelClassName, inputClassName: inputClassName, helpTextClassName: helpTextClassName, trailingClassName: trailingClassName, leadingClassName: leadingClassName, leadingInputClassName: leadingInputClassName, trailingInputClassName: trailingInputClassName, ref: ref, required: required, label: label, readOnly: readOnly })));
}
exports.default = (0, react_1.forwardRef)(Input);
