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
var RContextMenu = __importStar(require("@radix-ui/react-context-menu"));
var solid_1 = require("@heroicons/react/16/solid");
var link_1 = __importDefault(require("next/link"));
var clsx_1 = __importDefault(require("../../utils/clsx"));
var Dropdown_styles_1 = require("../../styles/Dropdown.styles");
function ContextMenuContent(_a) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    return ((0, jsx_runtime_1.jsx)(RContextMenu.Portal, { children: (0, jsx_runtime_1.jsx)(RContextMenu.Content, __assign({}, props, { className: (0, clsx_1.default)(Dropdown_styles_1.dropdownContentClassName, "ui-context-menu-content", className), children: children })) }));
}
function ContextMenuSeparator(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return ((0, jsx_runtime_1.jsx)(RContextMenu.Separator, __assign({}, props, { className: (0, clsx_1.default)(Dropdown_styles_1.dropdownSeparatorClassName, "ui-context-menu-separator", className) })));
}
function ContextMenuItem(_a) {
    var className = _a.className, href = _a.href, props = __rest(_a, ["className", "href"]);
    var Wrapper = href ? link_1.default : react_1.Fragment;
    return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (0, jsx_runtime_1.jsx)(Wrapper, __assign({}, (href ? { href: href } : {}), { children: (0, jsx_runtime_1.jsx)(RContextMenu.Item, __assign({}, props, { className: (0, clsx_1.default)(Dropdown_styles_1.dropdownItemClassName, "ui-context-menu-item", className) })) })));
}
function ContextMenuCheckboxItem(_a) {
    var className = _a.className, children = _a.children, indicatorClassName = _a.indicatorClassName, props = __rest(_a, ["className", "children", "indicatorClassName"]);
    return ((0, jsx_runtime_1.jsxs)(RContextMenu.CheckboxItem, __assign({}, props, { className: (0, clsx_1.default)(Dropdown_styles_1.dropdownCheckboxItemClassName, "ui-context-menu-checkbox-item", className), children: [(0, jsx_runtime_1.jsx)(RContextMenu.ItemIndicator, { className: (0, clsx_1.default)(Dropdown_styles_1.dropdownItemIndicatorClassName, "ui-context-menu-checkbox-item-indicator", indicatorClassName), children: (0, jsx_runtime_1.jsx)(solid_1.CheckIcon, {}) }), children] })));
}
var ContextMenu = {
    Root: RContextMenu.Root,
    Trigger: RContextMenu.Trigger,
    Content: ContextMenuContent,
    Item: ContextMenuItem,
    Separator: ContextMenuSeparator,
    CheckboxItem: ContextMenuCheckboxItem,
};
exports.default = ContextMenu;
