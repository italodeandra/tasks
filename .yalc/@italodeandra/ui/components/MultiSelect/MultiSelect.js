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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("@headlessui/react");
var Loading_1 = __importDefault(require("../Loading/Loading"));
var react_2 = require("react");
var UnstyledInput_1 = __importDefault(require("../Input/UnstyledInput"));
var Input_1 = require("../Input/Input");
var clsx_1 = __importDefault(require("clsx"));
var Menu_1 = require("../Menu/Menu");
var lodash_1 = require("lodash");
var solid_1 = require("@heroicons/react/20/solid");
var Badge_1 = __importDefault(require("../Badge/Badge"));
function getValue(item) {
    return typeof item === "string" ? item : item._id;
}
function MultiSelectInput(_a) {
    var className = _a.className, selectedItems = _a.selectedItems, doRender = _a.doRender, removeItem = _a.removeItem, props = __rest(_a, ["className", "selectedItems", "doRender", "removeItem"]);
    var ref = (0, react_2.useRef)(null);
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: (0, clsx_1.default)("flex flex-wrap border focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 dark:focus-within:border-primary-500", className), onClick: function () { var _a; return (_a = ref.current) === null || _a === void 0 ? void 0 : _a.focus(); } }, { children: [!!selectedItems.length && ((0, jsx_runtime_1.jsx)("div", __assign({ className: "flex flex-wrap items-center gap-1 p-1.5" }, { children: selectedItems.map(function (item) { return ((0, jsx_runtime_1.jsx)(Badge_1.default, __assign({ onActionClick: removeItem(item) }, { children: doRender(item) }), getValue(item))); }) }))), (0, jsx_runtime_1.jsx)(react_1.Combobox.Input
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            , __assign({}, props, { ref: ref, className: "rounded-md border-none !ring-transparent disabled:cursor-not-allowed disabled:text-gray-500 dark:bg-zinc-800 dark:disabled:bg-zinc-900/90 sm:text-sm" }))] })));
}
function MultiSelect(_a) {
    var placeholder = _a.placeholder, _b = _a.emptyText, emptyText = _b === void 0 ? "No item found." : _b, _c = _a.items, items = _c === void 0 ? [] : _c, _d = _a.renderProperty, renderProperty = _d === void 0 ? "title" : _d, renderFunction = _a.renderFunction, _e = _a.filterProperty, filterProperty = _e === void 0 ? "title" : _e, filterFunction = _a.filterFunction, onChange = _a.onChange, _f = _a.query, defaultQuery = _f === void 0 ? "" : _f, onChangeQuery = _a.onChangeQuery, loading = _a.loading, inputInnerClassName = _a.inputInnerClassName, inputElementClassName = _a.inputElementClassName, as = _a.as, trailing = _a.trailing, trailingClassName = _a.trailingClassName, trailingInputClassName = _a.trailingInputClassName, leadingInputClassName = _a.leadingInputClassName, isStatic = _a.static, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _g = _a.displayValue, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    displayValue = _g === void 0 ? function (item) { return (item === null || item === void 0 ? void 0 : item[renderProperty]) || ""; } : _g, value = _a.value, labelClassName = _a.labelClassName, creatable = _a.creatable, _h = _a.getCreateLabel, getCreateLabel = _h === void 0 ? function (query) { return "+ create \"".concat(query, "\""); } : _h, props = __rest(_a, ["placeholder", "emptyText", "items", "renderProperty", "renderFunction", "filterProperty", "filterFunction", "onChange", "query", "onChangeQuery", "loading", "inputInnerClassName", "inputElementClassName", "as", "trailing", "trailingClassName", "trailingInputClassName", "leadingInputClassName", "static", "displayValue", "value", "labelClassName", "creatable", "getCreateLabel"]);
    var _j = __read((0, react_2.useState)(defaultQuery), 2), query = _j[0], setQuery = _j[1];
    var _k = __read((0, react_2.useState)(value || []), 2), selectedItems = _k[0], setSelectedItems = _k[1];
    // noinspection DuplicatedCode
    (0, react_2.useEffect)(function () {
        if (query !== defaultQuery) {
            setQuery(defaultQuery);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultQuery]);
    (0, react_2.useEffect)(function () {
        if (onChangeQuery && query !== defaultQuery) {
            onChangeQuery(query);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onChangeQuery, query]);
    var filteredItems = (0, react_2.useMemo)(function () {
        return query === ""
            ? items
            : items.filter(filterFunction ||
                (function (item) {
                    return (typeof item === "string"
                        ? item
                        : item[filterProperty])
                        .toLowerCase()
                        .includes(query.toLowerCase());
                }));
    }, [filterFunction, filterProperty, items, query]);
    trailing = loading ? (0, jsx_runtime_1.jsx)(Loading_1.default, {}) : trailing;
    var ComponentInput = as || UnstyledInput_1.default;
    var doRender = (0, react_2.useCallback)(function (item) {
        return renderFunction
            ? renderFunction(item)
            : typeof item === "string"
                ? item
                : item[renderProperty];
    }, [renderFunction, renderProperty]);
    (0, react_2.useEffect)(function () {
        onChange === null || onChange === void 0 ? void 0 : onChange(selectedItems);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedItems]);
    (0, react_2.useEffect)(function () {
        if (!(0, lodash_1.isEqual)(selectedItems, value)) {
            setSelectedItems(value || []);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);
    var removeItem = (0, react_2.useCallback)(function (item) { return function () {
        return setSelectedItems(function (selectedItems) { return __spreadArray([], __read(selectedItems.filter(function (i) { return getValue(i) !== getValue(item); })), false); });
    }; }, []);
    return ((0, jsx_runtime_1.jsx)("div", __assign({ className: "relative" }, { children: (0, jsx_runtime_1.jsx)(react_1.Combobox
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        , __assign({ 
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            onChange: setSelectedItems, value: selectedItems, multiple: true }, { children: function (_a) {
                var open = _a.open;
                return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(ComponentInput
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        , __assign({}, props, { as: MultiSelectInput, placeholder: placeholder, value: query, onChange: function (event) { return setQuery(event.target.value); }, trailing: trailing, trailingClassName: (0, clsx_1.default)(Input_1.defaultTrailingClassName, trailingClassName), inputClassName: (0, clsx_1.default)(Input_1.defaultInputClassName, inputElementClassName), innerClassName: inputInnerClassName, trailingInputClassName: (0, clsx_1.default)(Input_1.defaultTrailingInputClassName, trailingInputClassName), leadingInputClassName: (0, clsx_1.default)(Input_1.defaultLeadingInputClassName, leadingInputClassName), displayValue: displayValue, labelClassName: (0, clsx_1.default)(Input_1.defaultLabelClassName, labelClassName), selectedItems: selectedItems, doRender: doRender, removeItem: removeItem })), ((creatable && query) || filteredItems.length > 0) && ((0, jsx_runtime_1.jsxs)(react_1.Combobox.Options, __assign({ static: isStatic, className: (0, clsx_1.default)(Menu_1.defaultMenuItemsClassName, "absolute z-10 mt-1 max-h-72 w-full scroll-py-2 overflow-y-auto py-2 text-sm text-gray-800 dark:text-zinc-200") }, { children: [creatable && !filteredItems.length && !!query && ((0, jsx_runtime_1.jsx)(react_1.Combobox.Option, __assign({ value: query, className: function (_a) {
                                        var active = _a.active;
                                        return (0, clsx_1.default)("cursor-default select-none px-4 py-2", {
                                            "bg-primary-600 text-white": active,
                                        });
                                    } }, { children: function (_a) {
                                        var selected = _a.selected;
                                        return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "flex" }, { children: [selected && (0, jsx_runtime_1.jsx)(solid_1.CheckIcon, { className: "mr-2 w-5" }), selected ? query : getCreateLabel(query)] })));
                                    } }))), filteredItems.map(function (item) { return ((0, jsx_runtime_1.jsx)(react_1.Combobox.Option, __assign({ value: item, className: function (_a) {
                                        var active = _a.active;
                                        return (0, clsx_1.default)("cursor-default select-none px-4 py-2", {
                                            "bg-primary-600 text-white": active,
                                        });
                                    } }, { children: function (_a) {
                                        var selected = _a.selected;
                                        return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "flex" }, { children: [selected && (0, jsx_runtime_1.jsx)(solid_1.CheckIcon, { className: "mr-2 w-5" }), doRender(item)] })));
                                    } }), getValue(item))); })] }))), !creatable &&
                            open &&
                            emptyText &&
                            query !== "" &&
                            filteredItems.length === 0 && ((0, jsx_runtime_1.jsx)("p", __assign({ className: (0, clsx_1.default)(Menu_1.defaultMenuItemsClassName, "absolute mt-1 w-full p-4 text-sm text-gray-500 dark:text-zinc-400") }, { children: emptyText })))] }));
            } })) })));
}
exports.default = MultiSelect;
