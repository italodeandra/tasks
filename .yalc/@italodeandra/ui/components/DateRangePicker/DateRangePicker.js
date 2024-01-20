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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_day_picker_1 = require("react-day-picker");
var dayjs_1 = __importDefault(require("dayjs"));
var solid_1 = require("@heroicons/react/20/solid");
var Button_1 = __importDefault(require("../Button"));
var clsx_1 = __importDefault(require("../../utils/clsx"));
var react_use_1 = require("react-use");
var Popover_1 = __importDefault(require("../Popover"));
var classNames = {
    button: "justify-start pl-4 min-h-[38px]",
    months: "flex gap-2",
    caption: "text-center h-9 flex items-center justify-center mx-9",
    navButtonPrevious: "left-2 top-2",
    navButtonNext: "right-2 top-2",
    navButton: (0, clsx_1.default)("absolute border rounded p-1.5 [&_svg]:w-3 [&_svg]:h-3 transition", "border-zinc-100 hover:bg-zinc-100 bg-white active:border-zinc-200", "dark:border-zinc-800 dark:hover:bg-zinc-800 dark:bg-zinc-900 dark:active:border-zinc-700", "disabled:opacity-50 disabled:cursor-not-allowed"),
    head: "text-xs dark:text-zinc-500",
    headCell: "font-normal",
    day: (0, clsx_1.default)("w-8 h-8 rounded transition", "text-zinc-700 hover:bg-black/10", "dark:text-zinc-300 dark:hover:bg-white/10", "disabled:opacity-30 disabled:cursor-not-allowed", "dark:disabled:opacity-20"),
    dayRangeStart: (0, clsx_1.default)("!text-onPrimary dark:!text-onPrimary", "bg-primary-500 hover:bg-primary-500/50", "dark:bg-primary-600 dark:hover:bg-primary-600/50"),
    dayRangeEnd: (0, clsx_1.default)("!text-onPrimary dark:!text-onPrimary", "bg-primary-500 hover:bg-primary-500/50", "dark:bg-primary-600 dark:hover:bg-primary-600/50"),
    table: "border-spacing-y-1 border-separate",
    cell: (0, clsx_1.default)("p-0", "has-[.ui-date-picker-day-outside]:opacity-40", "dark:has-[.ui-date-picker-day-outside]:opacity-30", "has-[.ui-date-picker-day-range-start]:rounded-l first:rounded-l", "has-[.ui-date-picker-day-range-start]:bg-black/5", "dark:has-[.ui-date-picker-day-range-start]:bg-white/10", "has-[.ui-date-picker-day-range-middle]:bg-black/5", "dark:has-[.ui-date-picker-day-range-middle]:bg-white/10", "has-[.ui-date-picker-day-range-end]:rounded-r last:rounded-r", "has-[.ui-date-picker-day-range-end]:bg-black/5", "dark:has-[.ui-date-picker-day-range-end]:bg-white/10"),
};
function DateRangePicker(_a) {
    var value = _a.value, onChangeValue = _a.onChangeValue, children = _a.children, buttonProps = _a.buttonProps, fromDate = _a.fromDate, toDate = _a.toDate, min = _a.min, max = _a.max;
    var _b = __read((0, react_1.useState)(value), 2), range = _b[0], setRange = _b[1];
    (0, react_use_1.useDeepCompareEffect)(function () {
        onChangeValue === null || onChangeValue === void 0 ? void 0 : onChangeValue(range);
    }, [range || {}]);
    var buttonText = (0, react_1.useMemo)(function () {
        var buttonText = "";
        if (range === null || range === void 0 ? void 0 : range.from) {
            if (!range.to) {
                buttonText = (0, dayjs_1.default)(range.from).format("ll");
            }
            else if (range.to) {
                buttonText = "".concat((0, dayjs_1.default)(range.from).format("ll"), " \u2013 ").concat((0, dayjs_1.default)(range.to).format("ll"));
            }
        }
        return buttonText;
    }, [range]);
    var children2 = children ? (children(buttonText)) : ((0, jsx_runtime_1.jsx)(Button_1.default, __assign({}, buttonProps, { leading: (buttonProps === null || buttonProps === void 0 ? void 0 : buttonProps.leading) || (0, jsx_runtime_1.jsx)(solid_1.CalendarIcon, {}), className: (0, clsx_1.default)(classNames.button, buttonProps === null || buttonProps === void 0 ? void 0 : buttonProps.className), children: buttonText })));
    return ((0, jsx_runtime_1.jsxs)(Popover_1.default.Root, { children: [(0, jsx_runtime_1.jsx)(Popover_1.default.Trigger, { asChild: true, children: children2 }), (0, jsx_runtime_1.jsx)(Popover_1.default.Portal, { children: (0, jsx_runtime_1.jsx)(Popover_1.default.Content, { children: (0, jsx_runtime_1.jsx)(react_day_picker_1.DayPicker, { mode: "range", defaultMonth: value === null || value === void 0 ? void 0 : value.from, selected: range, onSelect: setRange, numberOfMonths: 2, showOutsideDays: true, classNames: {
                            months: classNames.months,
                            caption: classNames.caption,
                            nav_button_previous: classNames.navButtonPrevious,
                            nav_button_next: classNames.navButtonNext,
                            nav_button: classNames.navButton,
                            head: classNames.head,
                            head_cell: classNames.headCell,
                            day: classNames.day,
                            cell: classNames.cell,
                            table: classNames.table,
                            day_range_start: (0, clsx_1.default)("ui-date-picker-day-range-start", classNames.dayRangeStart),
                            day_range_end: (0, clsx_1.default)("ui-date-picker-day-range-end", classNames.dayRangeEnd),
                            day_outside: "ui-date-picker-day-outside",
                            day_range_middle: "ui-date-picker-day-range-middle",
                        }, fromDate: fromDate, toDate: toDate, min: min, max: max }) }) })] }));
}
exports.default = DateRangePicker;
