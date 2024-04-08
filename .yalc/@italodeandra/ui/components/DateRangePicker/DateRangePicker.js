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
var DayPicker_classNames_1 = require("../../styles/DayPicker.classNames");
function DateRangePicker(_a) {
    var value = _a.value, onValueChange = _a.onValueChange, children = _a.children, buttonProps = _a.buttonProps, fromDate = _a.fromDate, toDate = _a.toDate, min = _a.min, max = _a.max, footer = _a.footer, monthFooter = _a.monthFooter;
    var _b = __read((0, react_1.useState)(value), 2), range = _b[0], setRange = _b[1];
    (0, react_use_1.useDeepCompareEffect)(function () {
        onValueChange === null || onValueChange === void 0 ? void 0 : onValueChange(range);
    }, [range || {}]);
    (0, react_use_1.useDeepCompareEffect)(function () {
        setRange(value);
    }, [value || {}]);
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
    var children2 = children ? (children(buttonText)) : ((0, jsx_runtime_1.jsx)(Button_1.default, __assign({}, buttonProps, { leading: (buttonProps === null || buttonProps === void 0 ? void 0 : buttonProps.leading) || (0, jsx_runtime_1.jsx)(solid_1.CalendarIcon, {}), className: (0, clsx_1.default)(DayPicker_classNames_1.dayPickerButtonClassName, buttonProps === null || buttonProps === void 0 ? void 0 : buttonProps.className), children: buttonText })));
    return ((0, jsx_runtime_1.jsxs)(Popover_1.default.Root, { children: [(0, jsx_runtime_1.jsx)(Popover_1.default.Trigger, { asChild: true, children: children2 }), (0, jsx_runtime_1.jsxs)(Popover_1.default.Content, { children: [(0, jsx_runtime_1.jsx)(react_day_picker_1.DayPicker, { mode: "range", defaultMonth: value === null || value === void 0 ? void 0 : value.from, selected: range, onSelect: setRange, numberOfMonths: 2, showOutsideDays: true, classNames: DayPicker_classNames_1.dayPickerClassNames, fromDate: fromDate, toDate: toDate, min: min, max: max, footer: monthFooter }), footer] })] }));
}
exports.default = DateRangePicker;
