"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var outline_1 = require("@heroicons/react/24/outline");
var Button_1 = __importDefault(require("../Button"));
var clsx_1 = __importDefault(require("../../utils/clsx"));
var react_1 = require("react");
var useModeToggle_1 = __importDefault(require("./useModeToggle"));
var ModeToggle = (0, react_1.forwardRef)(function ModeToggle(_a, ref) {
    var _b = _a.ariaLabel, ariaLabel = _b === void 0 ? "Toggle dark mode" : _b, className = _a.className, iconClassName = _a.iconClassName;
    var toggleMode = (0, useModeToggle_1.default)();
    return ((0, jsx_runtime_1.jsxs)(Button_1.default, { ref: ref, icon: true, variant: "text", "aria-label": ariaLabel, onClick: toggleMode, className: className, children: [(0, jsx_runtime_1.jsx)(outline_1.SunIcon, { className: (0, clsx_1.default)("dark:hidden", iconClassName) }), (0, jsx_runtime_1.jsx)(outline_1.MoonIcon, { className: (0, clsx_1.default)("hidden dark:block", iconClassName) })] }));
});
exports.default = ModeToggle;
