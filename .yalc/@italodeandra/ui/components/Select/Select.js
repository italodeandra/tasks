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
var RSelect = __importStar(require("@radix-ui/react-select"));
var solid_1 = require("@heroicons/react/16/solid");
var Button_1 = __importDefault(require("../Button"));
var clsx_1 = __importDefault(require("../../utils/clsx"));
function SelectContent(_a) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    return ((0, jsx_runtime_1.jsx)(RSelect.Portal, { children: (0, jsx_runtime_1.jsxs)(RSelect.Content, __assign({}, props, { className: (0, clsx_1.default)("ui-select-content", className), children: [(0, jsx_runtime_1.jsx)(RSelect.ScrollUpButton, { className: "ui-select-scroll-button", children: (0, jsx_runtime_1.jsx)(solid_1.ChevronUpIcon, {}) }), (0, jsx_runtime_1.jsx)(RSelect.Viewport, { children: children }), (0, jsx_runtime_1.jsx)(RSelect.ScrollDownButton, { className: "ui-select-scroll-button", children: (0, jsx_runtime_1.jsx)(solid_1.ChevronDownIcon, {}) })] })) }));
}
function SelectSeparator(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return ((0, jsx_runtime_1.jsx)(RSelect.Separator, __assign({}, props, { className: (0, clsx_1.default)("ui-select-separator", className) })));
}
function SelectItemComponent(_a, forwardedRef) {
    var children = _a.children, className = _a.className, props = __rest(_a, ["children", "className"]);
    return ((0, jsx_runtime_1.jsxs)(RSelect.Item, __assign({ className: (0, clsx_1.default)("ui-select-item", className) }, props, { ref: forwardedRef, children: [(0, jsx_runtime_1.jsx)(RSelect.ItemIndicator, { className: "ui-select-item-indicator", children: (0, jsx_runtime_1.jsx)(solid_1.CheckIcon, {}) }), (0, jsx_runtime_1.jsx)(RSelect.ItemText, { children: children })] })));
}
var SelectItem = (0, react_1.forwardRef)(SelectItemComponent);
function SelectTrigger(_a) {
    var className = _a.className, placeholder = _a.placeholder, children = _a.children, props = __rest(_a, ["className", "placeholder", "children"]);
    return ((0, jsx_runtime_1.jsx)(RSelect.Trigger, __assign({ asChild: true }, props, { className: className, children: children || ((0, jsx_runtime_1.jsx)(Button_1.default, { trailing: (0, jsx_runtime_1.jsx)(RSelect.Icon, { children: (0, jsx_runtime_1.jsx)(solid_1.ChevronDownIcon, {}) }), children: (0, jsx_runtime_1.jsx)(RSelect.Value, { placeholder: placeholder }) })) })));
}
function SelectLabel(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return ((0, jsx_runtime_1.jsx)(RSelect.Label, __assign({ className: (0, clsx_1.default)("ui-select-label", className) }, props)));
}
var Select = {
    Root: RSelect.Root,
    Item: SelectItem,
    Trigger: SelectTrigger,
    Content: SelectContent,
    Group: RSelect.Group,
    Label: SelectLabel,
    Separator: SelectSeparator,
    Icon: RSelect.Icon,
    Value: RSelect.Value,
};
exports.default = Select;
