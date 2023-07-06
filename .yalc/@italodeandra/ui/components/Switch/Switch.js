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
exports.SwitchInput = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("@headlessui/react");
var clsx_1 = __importDefault(require("clsx"));
var Input_1 = __importDefault(require("../Input/Input"));
function Switch(_a) {
    var srLabel = _a.srLabel, checked = _a.checked, onChange = _a.onChange, className = _a.className, rightLabel = _a.rightLabel, readOnly = _a.readOnly;
    return ((0, jsx_runtime_1.jsxs)(react_1.Switch.Group, __assign({ as: "div", className: (0, clsx_1.default)("flex items-center", className) }, { children: [(0, jsx_runtime_1.jsxs)(react_1.Switch, __assign({ checked: checked, onChange: onChange, className: (0, clsx_1.default)({
                    "bg-primary-600": checked,
                    "bg-zinc-300 dark:bg-zinc-600": !checked,
                    "cursor-pointer": !readOnly,
                }, "relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:ring-offset-zinc-900"), disabled: readOnly }, { children: [srLabel && (0, jsx_runtime_1.jsx)("span", __assign({ className: "sr-only" }, { children: srLabel })), (0, jsx_runtime_1.jsx)("span", { "aria-hidden": "true", className: (0, clsx_1.default)({
                            "translate-x-5": checked,
                            "translate-x-0": !checked,
                        }, "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out") })] })), rightLabel && ((0, jsx_runtime_1.jsx)(react_1.Switch.Label, __assign({ as: "span", className: "ml-3" }, { children: (0, jsx_runtime_1.jsx)("span", __assign({ className: "text-sm text-gray-500 dark:text-gray-300" }, { children: rightLabel })) })))] })));
}
exports.default = Switch;
function SwitchInput(_a) {
    var inputClassName = _a.inputClassName, props = __rest(_a, ["inputClassName"]);
    return ((0, jsx_runtime_1.jsx)(Input_1.default
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    , __assign({}, props, { as: Switch, inputClassName: (0, clsx_1.default)("p-1.5 border bg-white", inputClassName) })));
}
exports.SwitchInput = SwitchInput;
