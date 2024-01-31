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
var clsx_1 = __importDefault(require("../../utils/clsx"));
var react_1 = require("react");
var Loading_1 = __importDefault(require("../Loading"));
var styles = {
    root: (0, clsx_1.default)("appearance-none select-none border transition-colors inline-flex items-center justify-center font-medium leading-4 focus:outline-none", "ring-offset-zinc-100 focus-visible:ring-2 focus:ring-primary-500 focus:ring-offset-2", "dark:ring-offset-zinc-900"),
    variant: {
        filled: "shadow-sm",
        light: "shadow-sm",
        outlined: "shadow-sm",
        text: "",
        custom: "",
    },
    color: {
        primary: "",
        success: "",
        error: "",
        gray: "",
        default: "",
    },
    variantColor: {
        "filled-primary": "bg-primary-500 hover:bg-primary-500/80 text-onPrimary border-transparent active:border-primary-700 dark:active:border-primary-300",
        "filled-success": "bg-success-500 hover:bg-success-500/80 text-white border-transparent active:border-success-700 dark:active:border-success-300",
        "filled-error": "bg-red-500 hover:bg-red-500/80 text-white border-transparent active:border-red-700 dark:active:border-red-300",
        "filled-gray": "bg-zinc-500 hover:bg-zinc-500/80 text-white border-transparent active:border-zinc-500 dark:active:border-zinc-400",
        "filled-default": "bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-300 dark:hover:bg-zinc-400 text-zinc-900 border-transparent active:border-zinc-400 dark:active:border-zinc-300",
        "light-primary": "border-transparent text-primary-500 bg-primary-500/20 hover:bg-primary-500/30 active:border-primary-700",
        "light-success": "border-transparent text-success-500 bg-success-500/20 hover:bg-success-500/30 active:border-success-700",
        "light-error": "border-transparent text-error-500 bg-error-500/20 hover:bg-error-500/30 active:border-error-700",
        "light-gray": "border-transparent text-zinc-500 dark:text-zinc-300 bg-zinc-500/20 hover:bg-zinc-500/30 dark:hover:bg-zinc-400/30 active:border-zinc-700 dark:active:border-zinc-500",
        "light-default": "border-transparent dark:text-white bg-zinc-300/30 dark:bg-white/20 hover:bg-zinc-300/70 dark:hover:bg-white/30 active:border-zinc-400",
        "outlined-primary": "border-primary-500 text-primary-500 hover:bg-primary-500/10 active:border-primary-700",
        "outlined-success": "border-success-500 text-success-500 hover:bg-success-500/10 active:border-success-700",
        "outlined-error": "border-error-500 text-error-500 hover:bg-error-500/10 active:border-error-700",
        "outlined-gray": "border-zinc-400 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-500/10 active:border-zinc-700",
        "outlined-default": (0, clsx_1.default)("border-zinc-300 hover:bg-zinc-500/5 active:border-zinc-400", "dark:text-white dark:border-zinc-700 dark:hover:bg-zinc-500/5 dark:active:border-zinc-500"),
        "text-primary": "text-primary-500 hover:bg-primary-500/5 border-transparent active:border-primary-500",
        "text-success": "text-success-500 hover:bg-success-500/5 border-transparent active:border-success-500",
        "text-error": "text-error-500 hover:bg-error-500/5 border-transparent active:border-error-500",
        "text-gray": "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-500/5 border-transparent active:border-zinc-500",
        "text-default": "hover:bg-zinc-500/5 dark:hover:bg-white/5 border-transparent active:border-zinc-500/50 dark:active:border-white/50",
    },
    disabled: "opacity-50 pointer-events-none",
    size: {
        xs: {
            button: "px-2 py-1 text-xs",
        },
        sm: {
            button: "px-2 py-1.5 text-sm",
        },
        md: {
            button: "px-3 py-2 text-sm",
        },
        lg: {
            button: "px-5 py-3 text-md",
        },
        xl: {
            button: "px-6 py-4 text-lg",
        },
    },
    icon: {
        xs: {
            button: "p-1.5",
            icon: "w-3 h-3",
            leading: "mr-1.5 -ml-0.5",
            trailing: "ml-1.5 -mr-0.5",
        },
        sm: {
            button: "p-2",
            icon: "w-4 h-4",
            leading: "mr-1.5",
            trailing: "ml-1.5",
        },
        md: {
            button: "p-2",
            icon: "w-5 h-5",
            leading: "-my-0.5 mr-2 -ml-1",
            trailing: "-my-0.5 ml-2 -mr-1",
        },
        lg: {
            button: "p-3",
            icon: "w-6 h-6",
            leading: "-my-1 mr-3 -ml-2",
            trailing: "-my-1 ml-3 -mr-2",
        },
        xl: {
            button: "p-4",
            icon: "w-7 h-7",
            leading: "-my-2 mr-4 -ml-2",
            trailing: "-my-2 ml-4 -mr-2",
        },
    },
};
var Button = function (_a, ref) {
    var _b;
    var _c, _d, _e;
    var _f = _a.variant, variant = _f === void 0 ? "outlined" : _f, _g = _a.color, color = _g === void 0 ? "default" : _g, _h = _a.size, size = _h === void 0 ? "md" : _h, className = _a.className, icon = _a.icon, _j = _a.type, type = _j === void 0 ? "button" : _j, leading = _a.leading, trailing = _a.trailing, children = _a.children, loading = _a.loading, disabled = _a.disabled, rounded = _a.rounded, props = __rest(_a, ["variant", "color", "size", "className", "icon", "type", "leading", "trailing", "children", "loading", "disabled", "rounded"]);
    if (loading) {
        if (icon) {
            children = (0, jsx_runtime_1.jsx)(Loading_1.default, { className: "my-auto" });
        }
        else {
            trailing = (0, jsx_runtime_1.jsx)(Loading_1.default, { className: "w-auto h-auto mr-0", debounce: true });
        }
    }
    return ((0, jsx_runtime_1.jsxs)(UnstyledButton_1.default, __assign({ ref: ref }, props, { className: (0, clsx_1.default)(styles.root, styles.variant[variant], variant !== "custom" && styles.color[color], variant !== "custom" && styles.variantColor["".concat(variant, "-").concat(color)], icon ? styles.icon[size].button : styles.size[size].button, rounded ? "rounded-full" : "rounded", (_b = {},
            _b[styles.disabled] = disabled,
            _b), className), type: type, disabled: disabled, children: [leading &&
                (0, react_1.cloneElement)(leading, {
                    className: (0, clsx_1.default)(styles.icon[size].icon, styles.icon[size].leading, (_c = leading === null || leading === void 0 ? void 0 : leading.props) === null || _c === void 0 ? void 0 : _c.className),
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
                    }), trailing &&
                (0, react_1.cloneElement)(trailing, {
                    className: (0, clsx_1.default)(styles.icon[size].icon, styles.icon[size].trailing, (_e = trailing === null || trailing === void 0 ? void 0 : trailing.props) === null || _e === void 0 ? void 0 : _e.className),
                })] })));
};
exports.default = (0, react_1.forwardRef)(Button);
