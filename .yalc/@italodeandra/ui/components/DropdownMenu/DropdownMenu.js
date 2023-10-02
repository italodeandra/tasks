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
exports.menuItemClassName = exports.menuSeparatorClassName = exports.menuContentClassName = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var RDropdownMenu = __importStar(require("@radix-ui/react-dropdown-menu"));
var clsx_1 = __importDefault(require("clsx"));
var solid_1 = require("@heroicons/react/20/solid");
exports.menuContentClassName = "z-20 min-w-[220px] rounded-md bg-white p-[5px] shadow-lg ring-1 ring-black/5 will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade";
exports.menuSeparatorClassName = "m-[5px] h-[1px] bg-zinc-200";
function DropdownMenuContent(_a) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    return ((0, jsx_runtime_1.jsx)(RDropdownMenu.Portal, { children: (0, jsx_runtime_1.jsxs)(RDropdownMenu.Content, __assign({ sideOffset: 5 }, props, { className: (0, clsx_1.default)(exports.menuContentClassName, className) }, { children: [children, (0, jsx_runtime_1.jsx)(RDropdownMenu.Arrow, { className: "mt-px fill-black/5" })] })) }));
}
function DropdownMenuSeparator(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return ((0, jsx_runtime_1.jsx)(RDropdownMenu.Separator, __assign({}, props, { className: (0, clsx_1.default)(exports.menuSeparatorClassName, className) })));
}
exports.menuItemClassName = "relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] text-[13px] leading-none text-zinc-900 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-primary-500 data-[disabled]:text-zinc-300 data-[highlighted]:text-white";
var dropdownMenuItemClassName = (0, clsx_1.default)(exports.menuItemClassName, "group px-[5px]");
function DropdownMenuItem(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return ((0, jsx_runtime_1.jsx)(RDropdownMenu.Item, __assign({}, props, { className: (0, clsx_1.default)(dropdownMenuItemClassName, className) })));
}
function DropdownMenuCheckboxItem(_a) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    return ((0, jsx_runtime_1.jsxs)(RDropdownMenu.CheckboxItem, __assign({}, props, { className: (0, clsx_1.default)(dropdownMenuItemClassName, className) }, { children: [(0, jsx_runtime_1.jsx)(RDropdownMenu.ItemIndicator, __assign({ className: "absolute left-0 inline-flex w-[25px] items-center justify-center" }, { children: (0, jsx_runtime_1.jsx)(solid_1.CheckIcon, { className: "h-3 w-3" }) })), children] })));
}
var DropdownMenu = {
    Root: RDropdownMenu.Root,
    Trigger: RDropdownMenu.Trigger,
    Content: DropdownMenuContent,
    Item: DropdownMenuItem,
    Separator: DropdownMenuSeparator,
    CheckboxItem: DropdownMenuCheckboxItem,
};
exports.default = DropdownMenu;
