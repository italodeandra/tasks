"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var RTooltip = __importStar(require("@radix-ui/react-tooltip"));
var clsx_1 = __importDefault(require("../../utils/clsx"));
function Tooltip(_a) {
    var children = _a.children, content = _a.content, side = _a.side;
    if (!content) {
        return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children });
    }
    return ((0, jsx_runtime_1.jsx)(RTooltip.Provider, { children: (0, jsx_runtime_1.jsxs)(RTooltip.Root, { children: [(0, jsx_runtime_1.jsx)(RTooltip.Trigger, { asChild: true, children: children }), (0, jsx_runtime_1.jsx)(RTooltip.Portal, { children: (0, jsx_runtime_1.jsxs)(RTooltip.Content, { className: (0, clsx_1.default)("z-20 rounded bg-zinc-900/95 px-2 py-1 text-center text-sm text-white", " data-[state=closed]:animate-fadeOut data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade will-change-[transform,opacity]"), sideOffset: 5, side: side, children: [content, (0, jsx_runtime_1.jsx)(RTooltip.Arrow, { className: "fill-zinc-900/95" })] }) })] }) }));
}
exports.default = Tooltip;
