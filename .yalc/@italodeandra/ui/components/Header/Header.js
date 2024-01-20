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
var useScroll_1 = require("../../hooks/useScroll");
var react_1 = require("react");
var defaultTheme_1 = __importDefault(require("tailwindcss/defaultTheme"));
var useMediaQuery_1 = __importDefault(require("../../hooks/useMediaQuery"));
function Header(_a) {
    var className = _a.className, hideOnScroll = _a.hideOnScroll, props = __rest(_a, ["className", "hideOnScroll"]);
    var ref = (0, react_1.useRef)(null);
    var isMobile = (0, useMediaQuery_1.default)("(max-width: ".concat(defaultTheme_1.default.screens.md, ")"));
    (0, useScroll_1.useScrollYMovement)(74, function (scrollYMovement) {
        if (ref.current) {
            ref.current.style.transform = "translateY(-".concat(scrollYMovement, "px)");
        }
    }, !hideOnScroll && !isMobile);
    (0, react_1.useEffect)(function () {
        if (ref.current) {
            ref.current.style.transform = "";
        }
    }, [isMobile]);
    return ((0, jsx_runtime_1.jsx)("header", __assign({ ref: ref }, props, { className: (0, clsx_1.default)("fixed top-0 z-20 flex h-16 w-full items-center px-2.5 shadow-none shadow-slate-900/5 ring-offset-zinc-100 transition-colors duration-500 scrolled:shadow-md sm:px-4 md:px-6", "bg-white/95 backdrop-blur [@supports(backdrop-filter:blur(0))]:bg-white/75", "dark:bg-zinc-900/95 dark:[@supports(backdrop-filter:blur(0))]:bg-zinc-900/75", "not-scrolled:!bg-transparent", className) })));
}
exports.default = Header;
