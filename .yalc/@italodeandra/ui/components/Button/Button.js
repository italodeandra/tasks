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
var UnstyledButton_1 = __importDefault(require("./UnstyledButton"));
var clsx_1 = __importDefault(require("clsx"));
var react_1 = require("react");
var Loading_1 = __importDefault(require("../Loading/Loading"));
var styles = {
    root: "appearance-none select-none border transition-colors inline-flex items-center justify-center rounded-md font-medium leading-4 focus:outline-none focus-visible:ring-2 focus:ring-primary-500 focus:ring-offset-2 ring-offset-gray-100 dark:ring-offset-zinc-900",
    variant: {
        filled: "shadow-sm",
        light: "shadow-sm",
        outlined: "shadow-sm",
        text: "",
    },
    color: {
        primary: "",
        success: "",
        error: "",
        gray: "",
        white: "",
    },
    variantColor: {
        "filled-primary": "bg-primary-500 hover:bg-primary-500/80 text-onPrimary border-transparent active:border-primary-700 dark:active:border-primary-300",
        "filled-success": "bg-success-500 hover:bg-success-500/80 text-white border-transparent active:border-success-700 dark:active:border-success-300",
        "filled-error": "bg-red-500 hover:bg-red-500/80 text-white border-transparent active:border-red-700 dark:active:border-red-300",
        "filled-gray": "bg-zinc-300 hover:bg-zinc-200 text-zinc-900 border-transparent active:border-zinc-400 dark:active:border-zinc-600",
        "filled-white": "bg-white hover:bg-zinc-100 text-zinc-900 border-transparent active:border-zinc-300 dark:active:border-zinc-700",
        "light-primary": "border-primary-500 text-primary-500 bg-primary-500/30 hover:bg-primary-500/40 active:border-primary-700",
        "light-success": "border-success-500 text-success-500 bg-success-500/30 hover:bg-success-500/40 active:border-success-700",
        "light-error": "border-error-400 text-error-500 bg-error-500/30 hover:bg-error-500/40 active:border-error-700",
        "light-gray": "border-zinc-400 bg-zinc-500/30 hover:bg-zinc-500/40 dark:hover:bg-zinc-500/10 active:border-zinc-700",
        "light-white": "border-white dark:text-white bg-white/30 dark:bg-white/20 hover:bg-white/70 dark:hover:bg-white/30 active:border-zinc-500",
        "outlined-primary": "border-primary-500 text-primary-500 hover:bg-primary-500/10 active:border-primary-700",
        "outlined-success": "border-success-500 text-success-500 hover:bg-success-500/10 active:border-success-700",
        "outlined-error": "border-error-500 text-error-500 hover:bg-error-500/10 active:border-error-700",
        "outlined-gray": "border-zinc-400 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-500/10 active:border-zinc-700",
        "outlined-white": "dark:text-white border-zinc-300 dark:border-white/50 dark:hover:bg-white/5 hover:bg-zinc-500/5 active:border-zinc-500 dark:active:border-white",
        "text-primary": "text-primary-500 hover:bg-primary-500/10 border-transparent active:border-primary-500",
        "text-success": "text-success-500 hover:bg-success-500/10 border-transparent active:border-success-500",
        "text-error": "text-error-500 hover:bg-error-500/10 border-transparent active:border-error-500",
        "text-gray": "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-500/10 border-transparent active:border-zinc-500",
        "text-white": "dark:text-white hover:bg-zinc-500/5 dark:hover:bg-white/5 border-transparent active:border-zinc-500/50 dark:active:border-white/50",
    },
    disabled: "opacity-50 pointer-events-none",
    size: {
        md: {
            button: "px-4 py-3 sm:px-3 sm:py-2 sm:text-sm",
            icon: "w-4 h-4",
        },
        sm: {
            button: "px-3 py-2 sm:px-2 sm:py-1 sm:text-xs",
            icon: "w-3 h-3",
        },
    },
    icon: {
        md: {
            button: "px-3 py-3 sm:py-2 sm:px-2",
            icon: "w-6 h-6",
        },
        sm: {
            button: "px-2 py-2 sm:py-1 sm:px-1",
            icon: "w-4 h-4",
        },
    },
};
var Button = function (_a, ref) {
    var _b;
    var _c, _d, _e;
    var _f = _a.variant, variant = _f === void 0 ? "outlined" : _f, _g = _a.color, color = _g === void 0 ? ["outlined", "text"].includes(variant) ? "white" : "primary" : _g, _h = _a.size, size = _h === void 0 ? "md" : _h, className = _a.className, icon = _a.icon, _j = _a.type, type = _j === void 0 ? "button" : _j, leadingIcon = _a.leadingIcon, trailingIcon = _a.trailingIcon, children = _a.children, loading = _a.loading, disabled = _a.disabled, props = __rest(_a, ["variant", "color", "size", "className", "icon", "type", "leadingIcon", "trailingIcon", "children", "loading", "disabled"]);
    if (loading) {
        trailingIcon = (0, jsx_runtime_1.jsx)(Loading_1.default, { className: "!text-inherit" });
    }
    return ((0, jsx_runtime_1.jsxs)(UnstyledButton_1.default, __assign({ ref: ref }, props, { className: (0, clsx_1.default)(styles.root, styles.variant[variant], styles.color[color], styles.variantColor["".concat(variant, "-").concat(color)], icon ? styles.icon[size].button : styles.size[size].button, (_b = {},
            _b[styles.disabled] = disabled,
            _b), className), type: type, disabled: disabled }, { children: [leadingIcon &&
                (0, react_1.cloneElement)(leadingIcon, {
                    className: (0, clsx_1.default)("mr-2 -ml-0.5", styles.size[size].icon, (_c = leadingIcon === null || leadingIcon === void 0 ? void 0 : leadingIcon.props) === null || _c === void 0 ? void 0 : _c.className),
                }), !icon
                ? children
                : Array.isArray(children)
                    ? children.map(function (child, key) {
                        var _a;
                        return (0, react_1.cloneElement)(child, {
                            key: key,
                            className: (0, clsx_1.default)(styles.icon[size].icon, (_a = child === null || child === void 0 ? void 0 : child.props) === null || _a === void 0 ? void 0 : _a.className),
                        });
                    })
                    : (0, react_1.cloneElement)(children, {
                        className: (0, clsx_1.default)(styles.icon[size].icon, (_d = children === null || children === void 0 ? void 0 : children.props) === null || _d === void 0 ? void 0 : _d.className),
                    }), trailingIcon &&
                (0, react_1.cloneElement)(trailingIcon, {
                    className: (0, clsx_1.default)("ml-2 -mr-0.5", styles.size[size].icon, (_e = trailingIcon === null || trailingIcon === void 0 ? void 0 : trailingIcon.props) === null || _e === void 0 ? void 0 : _e.className),
                })] })));
};
exports.default = (0, react_1.forwardRef)(Button);
