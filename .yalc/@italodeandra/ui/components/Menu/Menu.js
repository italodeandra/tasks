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
exports.defaultMenuItemsClassName = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_2 = require("@headlessui/react");
var solid_1 = require("@heroicons/react/20/solid");
var clsx_1 = __importDefault(require("clsx"));
var Button_1 = __importDefault(require("../Button/Button"));
var UnstyledButton_1 = __importDefault(require("../Button/UnstyledButton"));
var Text_1 = __importDefault(require("../Text/Text"));
exports.defaultMenuItemsClassName = "z-10 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-800";
var Item = function MenuItem(_a) {
    var className = _a.className, icon = _a.icon, children = _a.children, props = __rest(_a, ["className", "icon", "children"]);
    return ((0, jsx_runtime_1.jsx)(react_2.Menu.Item, { children: function (_a) {
            var active = _a.active;
            return ((0, jsx_runtime_1.jsxs)(UnstyledButton_1.default, __assign({}, props, { type: "button", className: (0, clsx_1.default)("flex w-full items-center text-left", active
                    ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-700/50 dark:text-zinc-100"
                    : "text-zinc-700 dark:text-zinc-200", "block px-4 py-2 text-sm", className) }, { children: [icon &&
                        (0, react_1.cloneElement)(icon, {
                            className: (0, clsx_1.default)("w-5 mr-2", icon.props.className),
                        }), children] })));
        } }));
};
var Label = function MenuLabel(props) {
    return ((0, jsx_runtime_1.jsx)(Text_1.default, __assign({}, props, { variant: "label", className: (0, clsx_1.default)("w-full text-left", "block px-4 py-2 text-sm", props.className) })));
};
var Menu = (0, react_1.forwardRef)(function Menu(_a, ref) {
    var className = _a.className, iconClassName = _a.iconClassName, _b = _a.position, position = _b === void 0 ? "right" : _b, children = _a.children, label = _a.label, button = _a.button, buttonProps = _a.buttonProps, unmount = _a.unmount, menuItemsClassName = _a.menuItemsClassName, props = __rest(_a, ["className", "iconClassName", "position", "children", "label", "button", "buttonProps", "unmount", "menuItemsClassName"]);
    return ((0, jsx_runtime_1.jsxs)(react_2.Menu, __assign({ as: "div", className: (0, clsx_1.default)("relative inline-block text-left", className), ref: ref }, props, { children: [(0, jsx_runtime_1.jsx)("div", { children: button ? ((0, jsx_runtime_1.jsx)(react_2.Menu.Button, __assign({ as: react_1.Fragment }, { children: button }))) : ((0, jsx_runtime_1.jsx)(react_2.Menu.Button, __assign({ as: Button_1.default, className: (0, clsx_1.default)("flex w-full", buttonProps === null || buttonProps === void 0 ? void 0 : buttonProps.className), trailing: (0, jsx_runtime_1.jsx)(solid_1.ChevronDownIcon, { className: iconClassName }) }, buttonProps, { children: label }))) }), (0, jsx_runtime_1.jsx)(react_2.Transition, __assign({ as: react_1.Fragment, enter: "transition ease-out duration-100", enterFrom: "transform opacity-0 scale-95", enterTo: "transform opacity-100 scale-100", leave: "transition ease-in duration-75", leaveFrom: "transform opacity-100 scale-100", leaveTo: "transform opacity-0 scale-95" }, { children: (0, jsx_runtime_1.jsx)(react_2.Menu.Items, __assign({ unmount: unmount, className: (0, clsx_1.default)(exports.defaultMenuItemsClassName, "absolute mt-2 min-w-[14rem]", {
                        "right-0": position.includes("right"),
                        "origin-top-right": position.includes("right") && !position.includes("bottom"),
                        "origin-top-left": position.includes("left") && !position.includes("bottom"),
                        "origin-bottom-right": position.includes("right") && position.includes("bottom"),
                        "origin-bottom-left": position.includes("left") && position.includes("bottom"),
                        "left-0": position.includes("left"),
                        "bottom-0": position.includes("bottom"),
                    }, menuItemsClassName) }, { children: (0, jsx_runtime_1.jsx)("div", __assign({ className: "py-1" }, { children: children })) })) }))] })));
});
exports.default = Object.assign(Menu, { Label: Label, Item: Item });
