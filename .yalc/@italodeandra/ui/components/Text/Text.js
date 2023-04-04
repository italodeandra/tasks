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
exports.defaultTextStyles = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var clsx_1 = __importDefault(require("clsx"));
var link_1 = __importDefault(require("next/link"));
exports.defaultTextStyles = {
    variant: {
        default: "text-gray-700 hover:text-gray-700 dark:text-zinc-200",
        label: "text-gray-800 font-medium dark:text-zinc-100",
        secondary: "text-sm text-gray-500 dark:text-zinc-400",
        link: "font-medium text-primary-600 hover:text-primary-500",
    },
    size: {
        xs: "text-xs",
        sm: "text-sm",
        base: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
    },
};
function Text(_a) {
    var _b;
    var inline = _a.inline, _c = _a.variant, variant = _c === void 0 ? "default" : _c, className = _a.className, href = _a.href, target = _a.target, _d = _a.size, size = _d === void 0 ? variant !== "label" ? "base" : "sm" : _d, props = __rest(_a, ["inline", "variant", "className", "href", "target", "size"]);
    className = (0, clsx_1.default)(exports.defaultTextStyles.variant[variant], exports.defaultTextStyles.size[size], (_b = {},
        _b[exports.defaultTextStyles.variant.link] = !!href && variant === "default",
        _b), className);
    if (href) {
        return ((0, jsx_runtime_1.jsx)(link_1.default, __assign({ href: href, target: target }, props, { className: className })));
    }
    if (inline) {
        return (0, jsx_runtime_1.jsx)("span", __assign({}, props, { className: className }));
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (0, jsx_runtime_1.jsx)("div", __assign({}, props, { className: className }));
}
exports.default = Text;
