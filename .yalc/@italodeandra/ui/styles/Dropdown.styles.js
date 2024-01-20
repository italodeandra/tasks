"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropdownCheckboxItemIndicatorClassName = exports.dropdownCheckboxItemClassName = exports.dropdownLabelClassName = exports.dropdownItemClassName = exports.dropdownSeparatorClassName = exports.dropdownArrowClassName = exports.dropdownContentClassName = void 0;
var clsx_1 = __importDefault(require("../utils/clsx"));
exports.dropdownContentClassName = (0, clsx_1.default)("ui-dropdown-content", "z-20 rounded overflow-hidden p-1 shadow-md text-sm ring-1", "bg-white shadow-black/5 ring-black/5", "dark:bg-zinc-900 dark:ring-white/10");
exports.dropdownArrowClassName = (0, clsx_1.default)("ui-dropdown-arrow", "mt-px", "fill-black/5", "dark:fill-white/[0.09]");
exports.dropdownSeparatorClassName = (0, clsx_1.default)("ui-dropdown-separator", "h-px my-1 mx-[6px]", "bg-zinc-100", "dark:bg-zinc-700/30");
exports.dropdownItemClassName = (0, clsx_1.default)("ui-dropdown-item", "relative rounded py-1 px-7 cursor-pointer outline-none select-none", "data-[highlighted]:bg-black/5", "dark:data-[highlighted]:bg-white/5");
exports.dropdownLabelClassName = (0, clsx_1.default)("ui-dropdown-label", "py-1 px-7 text-xs font-medium cursor-default text-zinc-500 outline-none");
exports.dropdownCheckboxItemClassName = (0, clsx_1.default)("ui-dropdown-checkbox-item", exports.dropdownItemClassName);
exports.dropdownCheckboxItemIndicatorClassName = (0, clsx_1.default)("ui-dropdown-checkbox-item-indicator", "absolute left-1.5 top-1.5 inline-flex items-center justify-center", "[&>svg]:w-4 [&>svg]:h-4");
