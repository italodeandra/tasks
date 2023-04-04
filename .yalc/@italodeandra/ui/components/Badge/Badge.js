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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var clsx_1 = __importDefault(require("clsx"));
var link_1 = __importDefault(require("next/link"));
var react_1 = require("react");
var colorMap = {
    default: {
        badge: "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-100",
        button: "text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-500 dark:hover:text-zinc-300 focus:bg-zinc-500",
    },
    primary: {
        badge: "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-100",
        button: "text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-800 hover:text-primary-500 dark:hover:text-primary-300 focus:bg-primary-500",
    },
    success: {
        badge: "bg-success-100 dark:bg-success-900 text-success-700 dark:text-success-100",
        button: "text-success-400 hover:bg-success-200 dark:hover:bg-success-800 hover:text-success-500 dark:hover:text-success-300 focus:bg-success-500",
    },
    error: {
        badge: "bg-error-100 dark:bg-error-900 text-error-700 dark:text-error-100",
        button: "text-error-400 hover:bg-error-200 dark:hover:bg-error-800 hover:text-error-500 dark:hover:text-error-300 focus:bg-error-500",
    },
};
var sizeMap = {
    badge: {
        sm: "py-0.5 px-2 text-xs rounded-xl",
        md: "py-0.5 px-2.5 text-sm rounded-xl",
        lg: "py-0.5 px-3 text-md rounded-2xl",
    },
    button: {
        sm: "-mr-1",
        md: "-mr-1.5",
        lg: "-mr-1.5",
    },
};
function Badge(_a) {
    var _b = _a.color, color = _b === void 0 ? "default" : _b, _c = _a.size, size = _c === void 0 ? "md" : _c, className = _a.className, children = _a.children, onActionClick = _a.onActionClick, href = _a.href, shallow = _a.shallow, onClick = _a.onClick;
    var Component = href ? link_1.default : "span";
    var handleActionClick = (0, react_1.useCallback)(function (e) {
        e.preventDefault();
        onActionClick === null || onActionClick === void 0 ? void 0 : onActionClick();
    }, [onActionClick]);
    return ((0, jsx_runtime_1.jsxs)(Component, __assign({ className: (0, clsx_1.default)("inline-flex items-center py-0.5 font-medium", sizeMap.badge[size], colorMap[color].badge, className), href: href, shallow: shallow, onClick: onClick }, { children: [children, onActionClick && ((0, jsx_runtime_1.jsxs)("button", __assign({ type: "button", className: (0, clsx_1.default)("ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full focus:text-white focus:outline-none", sizeMap.button[size], colorMap[color].button), onClick: handleActionClick }, { children: [(0, jsx_runtime_1.jsx)("span", __assign({ className: "sr-only" }, { children: "Delete" })), (0, jsx_runtime_1.jsx)("svg", __assign({ className: "h-2 w-2", stroke: "currentColor", fill: "none", viewBox: "0 0 8 8" }, { children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeWidth: "1.5", d: "M1 1l6 6m0-6L1 7" }) }))] })))] })));
}
exports.default = Badge;
