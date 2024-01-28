"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropdownItemIndicatorClassName = exports.dropdownCheckboxItemClassName = exports.dropdownLabelClassName = exports.dropdownItemClassName = exports.dropdownSeparatorClassName = void 0;
var clsx_1 = __importDefault(require("../utils/clsx"));
exports.dropdownSeparatorClassName = (0, clsx_1.default)("ui-dropdown-separator", "h-px my-1 mx-[6px]", "bg-zinc-100", "dark:bg-zinc-700/30");
exports.dropdownItemClassName = (0, clsx_1.default)("ui-dropdown-item", "relative rounded py-1 px-7 cursor-pointer outline-none select-none", "data-[highlighted]:bg-black/5", "dark:data-[highlighted]:bg-white/5");
exports.dropdownLabelClassName = (0, clsx_1.default)("ui-dropdown-label", "py-1 px-7 text-xs font-medium cursor-default text-zinc-500 outline-none");
exports.dropdownCheckboxItemClassName = (0, clsx_1.default)("ui-dropdown-checkbox-item", exports.dropdownItemClassName);
exports.dropdownItemIndicatorClassName = (0, clsx_1.default)("ui-dropdown-item-indicator", "absolute left-1.5 top-1.5 inline-flex items-center justify-center", "[&>svg]:w-4 [&>svg]:h-4");
