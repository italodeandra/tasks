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
var solid_1 = require("@heroicons/react/20/solid");
var clsx_1 = __importDefault(require("clsx"));
var Group_1 = __importDefault(require("../Group/Group"));
var styles = {
    variants: {
        default: {
            root: "bg-warn-100 dark:bg-warn-900",
            icon: "text-warn-400",
            title: "text-warn-800 dark:text-warn-400",
            content: "text-warn-700 dark:text-warn-200",
        },
        error: {
            root: "bg-error-100 dark:bg-error-900",
            icon: "text-error-400 dark:text-error-300",
            title: "text-error-800 dark:text-error-300",
            content: "text-error-700 dark:text-error-200",
        },
        success: {
            root: "bg-success-100 dark:bg-success-900",
            icon: "text-success-400",
            title: "text-success-800 dark:text-success-400",
            content: "text-success-700 dark:text-success-200",
        },
    },
};
var icons = {
    default: solid_1.ExclamationTriangleIcon,
    error: solid_1.XCircleIcon,
    success: solid_1.CheckCircleIcon,
};
function Alert(_a) {
    var _b = _a.variant, variant = _b === void 0 ? "default" : _b, title = _a.title, children = _a.children, className = _a.className, actions = _a.actions, props = __rest(_a, ["variant", "title", "children", "className", "actions"]);
    var Icon = icons[variant];
    return ((0, jsx_runtime_1.jsx)("div", __assign({ className: (0, clsx_1.default)("rounded-md p-4", styles.variants[variant].root, className) }, props, { children: (0, jsx_runtime_1.jsxs)("div", __assign({ className: "flex" }, { children: [(0, jsx_runtime_1.jsx)("div", __assign({ className: "flex-shrink-0" }, { children: (0, jsx_runtime_1.jsx)(Icon, { className: (0, clsx_1.default)("h-5 w-5", styles.variants[variant].icon), "aria-hidden": "true" }) })), (0, jsx_runtime_1.jsxs)("div", __assign({ className: "ml-3 flex w-full flex-col items-start justify-between sm:flex-row" }, { children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", __assign({ className: (0, clsx_1.default)("text-sm font-medium", styles.variants[variant].title) }, { children: title })), children && ((0, jsx_runtime_1.jsx)("div", __assign({ className: (0, clsx_1.default)("mt-2 text-sm", styles.variants[variant].content) }, { children: children })))] }), actions && ((0, jsx_runtime_1.jsx)(Group_1.default, __assign({ className: (0, clsx_1.default)("-mx-4 mt-1 -mb-2 sm:-mx-2 sm:-my-2", styles.variants[variant].content) }, { children: actions })))] }))] })) })));
}
exports.default = Alert;
