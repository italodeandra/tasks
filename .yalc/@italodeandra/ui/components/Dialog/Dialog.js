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
var RDialog = __importStar(require("@radix-ui/react-dialog"));
var solid_1 = require("@heroicons/react/16/solid");
var Button_1 = __importDefault(require("../Button"));
var clsx_1 = __importDefault(require("../../utils/clsx"));
var Modal_classNames_1 = require("../../styles/Modal.classNames");
function Dialog(_a) {
    var children = _a.children, title = _a.title, description = _a.description, open = _a.open, onOpenChange = _a.onOpenChange;
    return ((0, jsx_runtime_1.jsx)(RDialog.Root, { open: open, onOpenChange: onOpenChange, children: (0, jsx_runtime_1.jsx)(RDialog.Portal, { children: (0, jsx_runtime_1.jsx)(RDialog.Overlay, { className: (0, clsx_1.default)("ui-dialog-overlay", "z-20 bg-black/50 fixed inset-0 flex items-center justify-center", "data-[state=open]:animate-slideUpAndFade data-[state=closed]:animate-fadeOut will-change-[opacity,transform]"), children: (0, jsx_runtime_1.jsxs)(RDialog.Content, { className: (0, clsx_1.default)(Modal_classNames_1.modalContentClassName, "ui-dialog-content", "p-4 max-h-[85vh] w-[90vw] max-w-[450px] focus:outline-none flex flex-col gap-3 relative"), children: [title && ((0, jsx_runtime_1.jsx)(RDialog.Title, { className: (0, clsx_1.default)("ui-dialog-title", "text-zinc-900 dark:text-zinc-50 text-lg font-medium -mb-1"), children: title })), description && ((0, jsx_runtime_1.jsx)(RDialog.Description, { className: (0, clsx_1.default)("ui-dialog-description", "text-zinc-700 dark:text-zinc-300"), children: description })), children, (0, jsx_runtime_1.jsx)(RDialog.Close, { asChild: true, children: (0, jsx_runtime_1.jsx)(Button_1.default, { className: (0, clsx_1.default)("ui-dialog-close-button", "absolute top-1 right-1"), "aria-label": "Close", variant: "text", icon: true, size: "sm", children: (0, jsx_runtime_1.jsx)(solid_1.XMarkIcon, {}) }) })] }) }) }) }));
}
exports.default = Dialog;
