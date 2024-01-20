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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var react_1 = require("react");
var RDropdownMenu = __importStar(require("@radix-ui/react-dropdown-menu"));
var clsx_1 = __importDefault(require("../../utils/clsx"));
var solid_1 = require("@heroicons/react/20/solid");
var link_1 = __importDefault(require("next/link"));
var Dropdown_styles_1 = require("../../styles/Dropdown.styles");
function DropdownMenuContent(_a) {
    var className = _a.className, arrowClassName = _a.arrowClassName, children = _a.children, _b = _a.sideOffset, sideOffset = _b === void 0 ? 5 : _b, _c = _a.collisionPadding, collisionPadding = _c === void 0 ? 8 : _c, props = __rest(_a, ["className", "arrowClassName", "children", "sideOffset", "collisionPadding"]);
    return ((0, jsx_runtime_1.jsx)(RDropdownMenu.Portal, { children: (0, jsx_runtime_1.jsxs)(RDropdownMenu.Content, __assign({ sideOffset: sideOffset, collisionPadding: collisionPadding }, props, { className: (0, clsx_1.default)(Dropdown_styles_1.dropdownContentClassName, "ui-dropdown-menu-content", className), children: [children, (0, jsx_runtime_1.jsx)(RDropdownMenu.Arrow, { className: (0, clsx_1.default)(Dropdown_styles_1.dropdownArrowClassName, "ui-dropdown-menu-arrow", arrowClassName) })] })) }));
}
function DropdownMenuSeparator(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return ((0, jsx_runtime_1.jsx)(RDropdownMenu.Separator, __assign({}, props, { className: (0, clsx_1.default)(Dropdown_styles_1.dropdownSeparatorClassName, "ui-dropdown-menu-separator", className) })));
}
function DropdownMenuItem(_a) {
    var className = _a.className, href = _a.href, props = __rest(_a, ["className", "href"]);
    var Wrapper = href ? link_1.default : react_1.Fragment;
    return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (0, jsx_runtime_1.jsx)(Wrapper, __assign({}, (href ? { href: href } : {}), { children: (0, jsx_runtime_1.jsx)(RDropdownMenu.Item, __assign({}, props, { className: (0, clsx_1.default)(Dropdown_styles_1.dropdownItemClassName, "ui-dropdown-menu-item", className) })) })));
}
function DropdownMenuLabel(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return ((0, jsx_runtime_1.jsx)(RDropdownMenu.Item, __assign({}, props, { className: (0, clsx_1.default)(Dropdown_styles_1.dropdownLabelClassName, "ui-dropdown-menu-label", className) })));
}
function DropdownMenuCheckboxItem(_a) {
    var className = _a.className, children = _a.children, indicatorClassName = _a.indicatorClassName, props = __rest(_a, ["className", "children", "indicatorClassName"]);
    return ((0, jsx_runtime_1.jsxs)(RDropdownMenu.CheckboxItem, __assign({}, props, { className: (0, clsx_1.default)(Dropdown_styles_1.dropdownCheckboxItemClassName, "ui-dropdown-menu-checkbox-item", className), children: [(0, jsx_runtime_1.jsx)(RDropdownMenu.ItemIndicator, { className: (0, clsx_1.default)(Dropdown_styles_1.dropdownCheckboxItemIndicatorClassName, "ui-dropdown-menu-checkbox-item-indicator", indicatorClassName), children: (0, jsx_runtime_1.jsx)(solid_1.CheckIcon, {}) }), children] })));
}
var DropdownMenu = {
    Root: RDropdownMenu.Root,
    Trigger: RDropdownMenu.Trigger,
    Content: DropdownMenuContent,
    Item: DropdownMenuItem,
    Separator: DropdownMenuSeparator,
    CheckboxItem: DropdownMenuCheckboxItem,
    Label: DropdownMenuLabel,
};
exports.default = DropdownMenu;
