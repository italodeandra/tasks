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
exports.ModeToggle = exports.useModeToggle = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var outline_1 = require("@heroicons/react/24/outline");
var Button_1 = __importDefault(require("../Button/Button"));
var clsx_1 = __importDefault(require("clsx"));
var react_1 = require("react");
function useModeToggle() {
    function disableTransitionsTemporarily() {
        document.documentElement.classList.add("[&_*]:!transition-none");
        window.setTimeout(function () {
            document.documentElement.classList.remove("[&_*]:!transition-none");
        }, 0);
    }
    function toggleMode() {
        disableTransitionsTemporarily();
        var darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        var isSystemDarkMode = darkModeMediaQuery.matches;
        var isDarkMode = document.documentElement.classList.toggle("dark");
        if (isDarkMode === isSystemDarkMode) {
            delete window.localStorage.isDarkMode;
        }
        else {
            window.localStorage.isDarkMode = isDarkMode;
        }
    }
    return toggleMode;
}
exports.useModeToggle = useModeToggle;
var ModeToggle = (0, react_1.forwardRef)(function ModeToggle(_a, ref) {
    var _b = _a.ariaLabel, ariaLabel = _b === void 0 ? "Toggle dark mode" : _b, className = _a.className, iconClassName = _a.iconClassName;
    var toggleMode = useModeToggle();
    return ((0, jsx_runtime_1.jsxs)(Button_1.default, __assign({ ref: ref, icon: true, variant: "text", "aria-label": ariaLabel, onClick: toggleMode, className: className }, { children: [(0, jsx_runtime_1.jsx)(outline_1.SunIcon, { className: (0, clsx_1.default)("dark:hidden", iconClassName) }), (0, jsx_runtime_1.jsx)(outline_1.MoonIcon, { className: (0, clsx_1.default)("hidden dark:block", iconClassName) })] })));
});
exports.ModeToggle = ModeToggle;
