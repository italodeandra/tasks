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
var RPopover = __importStar(require("@radix-ui/react-popover"));
var react_1 = require("react");
var clsx_1 = __importDefault(require("../../utils/clsx"));
var Modal_classNames_1 = require("../../styles/Modal.classNames");
function PopoverContentWithRef(_a, ref) {
    var className = _a.className, _b = _a.sideOffset, sideOffset = _b === void 0 ? 4 : _b, _c = _a.collisionPadding, collisionPadding = _c === void 0 ? 8 : _c, children = _a.children, props = __rest(_a, ["className", "sideOffset", "collisionPadding", "children"]);
    return ((0, jsx_runtime_1.jsx)(RPopover.Portal, { children: (0, jsx_runtime_1.jsxs)(RPopover.Content, __assign({}, props, { className: (0, clsx_1.default)(Modal_classNames_1.modalContentClassName, "ui-popover-content", className), sideOffset: sideOffset, collisionPadding: collisionPadding, ref: ref, children: [children, (0, jsx_runtime_1.jsx)(PopoverArrow, {})] })) }));
}
var PopoverContent = (0, react_1.forwardRef)(PopoverContentWithRef);
function PopoverArrow(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return ((0, jsx_runtime_1.jsx)(RPopover.Arrow, __assign({}, props, { className: (0, clsx_1.default)(Modal_classNames_1.modalArrowClassName, "ui-popover-arrow", className) })));
}
var Popover = {
    Content: PopoverContent,
    Root: RPopover.Root,
    Trigger: RPopover.Trigger,
    Arrow: PopoverArrow,
};
exports.default = Popover;
