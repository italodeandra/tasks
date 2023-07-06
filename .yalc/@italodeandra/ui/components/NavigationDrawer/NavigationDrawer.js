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
var Drawer_1 = __importDefault(require("../Drawer/Drawer"));
var navigationDrawer_state_1 = __importDefault(require("./navigationDrawer.state"));
var valtio_1 = require("valtio");
var react_1 = require("@headlessui/react");
var clsx_1 = __importDefault(require("clsx"));
var react_use_1 = require("react-use");
var defaultTheme_1 = __importDefault(require("tailwindcss/defaultTheme"));
function NavigationDrawer(_a) {
    var children = _a.children, navigationChildren = _a.navigationChildren, position = _a.position, title = _a.title;
    var _b = (0, valtio_1.useSnapshot)(navigationDrawer_state_1.default), isOpen = _b.isOpen, setOpen = _b.setOpen;
    var isDesktop = (0, react_use_1.useMedia)("(min-width: ".concat(defaultTheme_1.default.screens.lg, ")"), false);
    var isMobile = !isDesktop;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Drawer_1.default, __assign({ open: isMobile && isOpen, onClose: isMobile ? setOpen : undefined, className: "lg:hidden", position: position, title: title }, { children: navigationChildren })), (0, jsx_runtime_1.jsx)(react_1.Transition, __assign({ className: (0, clsx_1.default)("fixed left-0 top-0 hidden h-full w-full max-w-xs flex-1 overflow-y-auto px-4 py-4 pt-20 lg:block", "bg-zinc-100/95 backdrop-blur [@supports(backdrop-filter:blur(0))]:bg-zinc-100/75", "dark:bg-zinc-900/95 dark:[@supports(backdrop-filter:blur(0))]:bg-zinc-900/75"), show: isOpen, enter: "transition-transform duration-150", enterFrom: "-translate-x-full", enterTo: "translate-x-0", leave: "transition-transform duration-300", leaveFrom: "translate-x-0", leaveTo: "-translate-x-full" }, { children: navigationChildren })), (0, jsx_runtime_1.jsx)("div", __assign({ className: (0, clsx_1.default)("flex min-h-screen flex-col ring-offset-gray-100 transition-all duration-300", {
                    "pl-80 duration-150": isOpen && !isMobile,
                }) }, { children: children }))] }));
}
exports.default = NavigationDrawer;
