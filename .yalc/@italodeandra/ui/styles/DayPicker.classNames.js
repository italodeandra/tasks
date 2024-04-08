"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dayPickerClassNames = exports.dayPickerDayRangeMiddleClassName = exports.dayPickerDayOutsideClassName = exports.dayPickerCellClassName = exports.dayPickerTableClassName = exports.dayPickerDayRangeEndClassName = exports.dayPickerDaySelectedClassName = exports.dayPickerDayRangeStartClassName = exports.dayPickerDayClassName = exports.dayPickerHeadCellClassName = exports.dayPickerHeadClassName = exports.dayPickerNavButtonClassName = exports.dayPickerNavButtonNextClassName = exports.dayPickerNavButtonPreviousClassName = exports.dayPickerCaptionClassName = exports.dayPickerMonthsClassName = exports.dayPickerButtonClassName = void 0;
var clsx_1 = __importDefault(require("../utils/clsx"));
exports.dayPickerButtonClassName = "justify-start pl-4 min-h-[38px]";
exports.dayPickerMonthsClassName = "flex gap-2";
exports.dayPickerCaptionClassName = "text-center h-9 flex items-center justify-center mx-9";
exports.dayPickerNavButtonPreviousClassName = "left-2 top-2";
exports.dayPickerNavButtonNextClassName = "right-2 top-2";
exports.dayPickerNavButtonClassName = (0, clsx_1.default)("absolute border rounded p-1.5 [&_svg]:w-3 [&_svg]:h-3 transition", "border-zinc-100 hover:bg-zinc-100 bg-white active:border-zinc-200", "dark:border-zinc-800 dark:hover:bg-zinc-800 dark:bg-zinc-900 dark:active:border-zinc-700", "disabled:opacity-50 disabled:cursor-not-allowed");
exports.dayPickerHeadClassName = "text-xs dark:text-zinc-500";
exports.dayPickerHeadCellClassName = "font-normal";
exports.dayPickerDayClassName = (0, clsx_1.default)("w-8 h-8 rounded transition", "text-zinc-700 hover:bg-black/10", "dark:text-zinc-300 dark:hover:bg-white/10", "disabled:opacity-30 disabled:cursor-not-allowed", "dark:disabled:opacity-20");
exports.dayPickerDayRangeStartClassName = (0, clsx_1.default)("ui-date-picker-day-range-start", "!text-onPrimary dark:!text-onPrimary", "bg-primary-500 hover:bg-primary-500/50", "dark:bg-primary-600 dark:hover:bg-primary-600/50");
exports.dayPickerDaySelectedClassName = (0, clsx_1.default)("ui-date-picker-day-selected", "[&:not(.ui-date-picker-day-range-middle)]:!text-onPrimary dark:[&:not(.ui-date-picker-day-range-middle)]:!text-onPrimary", "[&:not(.ui-date-picker-day-range-middle)]:bg-primary-500 hover:[&:not(.ui-date-picker-day-range-middle)]:bg-primary-500/50", "dark:[&:not(.ui-date-picker-day-range-middle)]:bg-primary-600 dark:hover:[&:not(.ui-date-picker-day-range-middle)]:bg-primary-600/50");
exports.dayPickerDayRangeEndClassName = (0, clsx_1.default)("ui-date-picker-day-range-end", "!text-onPrimary dark:!text-onPrimary", "bg-primary-500 hover:bg-primary-500/50", "dark:bg-primary-600 dark:hover:bg-primary-600/50");
exports.dayPickerTableClassName = "border-spacing-y-1 border-separate";
exports.dayPickerCellClassName = (0, clsx_1.default)("p-0", "has-[.ui-date-picker-day-outside]:opacity-40", "dark:has-[.ui-date-picker-day-outside]:opacity-30", "has-[.ui-date-picker-day-range-start]:rounded-l first:rounded-l", "has-[.ui-date-picker-day-range-start]:bg-black/5", "dark:has-[.ui-date-picker-day-range-start]:bg-white/10", "has-[.ui-date-picker-day-range-middle]:bg-black/5", "dark:has-[.ui-date-picker-day-range-middle]:bg-white/10", "has-[.ui-date-picker-day-range-end]:rounded-r last:rounded-r", "has-[.ui-date-picker-day-range-end]:bg-black/5", "dark:has-[.ui-date-picker-day-range-end]:bg-white/10");
exports.dayPickerDayOutsideClassName = "ui-date-picker-day-outside";
exports.dayPickerDayRangeMiddleClassName = "ui-date-picker-day-range-middle";
exports.dayPickerClassNames = {
    months: exports.dayPickerMonthsClassName,
    caption: exports.dayPickerCaptionClassName,
    nav_button_previous: exports.dayPickerNavButtonPreviousClassName,
    nav_button_next: exports.dayPickerNavButtonNextClassName,
    nav_button: exports.dayPickerNavButtonClassName,
    head: exports.dayPickerHeadClassName,
    head_cell: exports.dayPickerHeadCellClassName,
    day: exports.dayPickerDayClassName,
    cell: exports.dayPickerCellClassName,
    table: exports.dayPickerTableClassName,
    day_range_start: exports.dayPickerDayRangeStartClassName,
    day_selected: exports.dayPickerDaySelectedClassName,
    day_range_end: exports.dayPickerDayRangeEndClassName,
    day_outside: exports.dayPickerDayOutsideClassName,
    day_range_middle: exports.dayPickerDayRangeMiddleClassName,
};
