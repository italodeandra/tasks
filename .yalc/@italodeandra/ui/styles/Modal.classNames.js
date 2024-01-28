"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.modalArrowClassName = exports.modalContentClassName = void 0;
var clsx_1 = __importDefault(require("../utils/clsx"));
exports.modalContentClassName = (0, clsx_1.default)("ui-modal-content", "z-20 rounded overflow-hidden p-1 shadow-md text-sm ring-1", "bg-white shadow-black/5 ring-black/5", "dark:bg-zinc-900 dark:ring-white/10", "data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut");
exports.modalArrowClassName = (0, clsx_1.default)("ui-modal-arrow", "mt-px", "fill-black/5", "dark:fill-white/[0.09]");
