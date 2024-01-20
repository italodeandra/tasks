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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("@headlessui/react");
var Loading_1 = __importDefault(require("../Loading"));
var react_2 = require("react");
var Input_1 = require("../Input");
var clsx_1 = __importDefault(require("../../utils/clsx"));
var solid_1 = require("@heroicons/react/20/solid");
var react_use_1 = require("react-use");
var lodash_1 = require("lodash");
function UnstyledAutocomplete(_a) {
    var placeholder = _a.placeholder, emptyText = _a.emptyText, _b = _a.items, items = _b === void 0 ? [] : _b, _c = _a.renderProperty, renderProperty = _c === void 0 ? "title" : _c, renderFunction = _a.renderFunction, _d = _a.filterProperty, filterProperty = _d === void 0 ? "title" : _d, filterFunction = _a.filterFunction, onSelect = _a.onSelect, _e = _a.query, defaultQuery = _e === void 0 ? "" : _e, onChangeQuery = _a.onChangeQuery, loading = _a.loading, emptyTextClassName = _a.emptyTextClassName, optionsClassName = _a.optionsClassName, optionClassName = _a.optionClassName, inputInnerClassName = _a.inputInnerClassName, inputElementClassName = _a.inputElementClassName, as = _a.as, trailing = _a.trailing, trailingClassName = _a.trailingClassName, trailingInputClassName = _a.trailingInputClassName, leadingInputClassName = _a.leadingInputClassName, isStatic = _a.static, displayValue = _a.displayValue, value = _a.value, readOnly = _a.readOnly, itemsRenderLimit = _a.itemsRenderLimit, props = __rest(_a, ["placeholder", "emptyText", "items", "renderProperty", "renderFunction", "filterProperty", "filterFunction", "onSelect", "query", "onChangeQuery", "loading", "emptyTextClassName", "optionsClassName", "optionClassName", "inputInnerClassName", "inputElementClassName", "as", "trailing", "trailingClassName", "trailingInputClassName", "leadingInputClassName", "static", "displayValue", "value", "readOnly", "itemsRenderLimit"]);
    displayValue =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        displayValue || (function (item) { return (item === null || item === void 0 ? void 0 : item[renderProperty]) || ""; });
    var _f = __read((0, react_2.useState)(defaultQuery), 2), query = _f[0], setQuery = _f[1];
    var _g = __read((0, react_2.useState)(null), 2), selectedItem = _g[0], setSelectedItem = _g[1];
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
                    return item[filterProperty]
                        .toLowerCase()
                        .includes(query.toLowerCase());
                }));
    }, [filterFunction, filterProperty, items, query]);
    trailing = loading ? ((0, jsx_runtime_1.jsx)(Loading_1.default, {})) : (trailing ||
        (!readOnly ? ((0, jsx_runtime_1.jsx)(react_1.Combobox.Button, { className: "pointer-events-auto -mr-1 flex items-center", children: (0, jsx_runtime_1.jsx)(solid_1.ChevronUpDownIcon, { className: "h-5 w-5 text-zinc-400", "aria-hidden": "true" }) })) : undefined));
    var ComponentInput = as || Input_1.UnstyledInput;
    var doRender = (0, react_2.useCallback)(function (item) {
        return renderFunction ? renderFunction(item) : item[renderProperty];
    }, [renderFunction, renderProperty]);
    (0, react_use_1.useUpdateEffect)(function () {
        onSelect === null || onSelect === void 0 ? void 0 : onSelect(selectedItem);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedItem]);
    (0, react_2.useEffect)(function () {
        if (selectedItem !== value) {
            setSelectedItem(value || null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);
    return ((0, jsx_runtime_1.jsx)(react_1.Combobox, { onChange: setSelectedItem, value: selectedItem, nullable: true, children: function (_a) {
            var open = _a.open;
            return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "relative", children: (0, jsx_runtime_1.jsx)(ComponentInput
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        , __assign({}, props, { as: react_1.Combobox.Input, placeholder: placeholder, onChange: function (event) { return setQuery(event.target.value); }, trailing: trailing, trailingClassName: (0, clsx_1.default)(Input_1.defaultTrailingClassName, trailingClassName), inputClassName: (0, clsx_1.default)(Input_1.defaultInputClassName, inputElementClassName), innerClassName: inputInnerClassName, trailingInputClassName: (0, clsx_1.default)(Input_1.defaultTrailingInputClassName, trailingInputClassName), leadingInputClassName: (0, clsx_1.default)(Input_1.defaultLeadingInputClassName, leadingInputClassName), displayValue: displayValue, readOnly: readOnly })) }), filteredItems.length > 0 && !readOnly && ((0, jsx_runtime_1.jsx)(react_1.Combobox.Options, { static: isStatic, className: optionsClassName, children: (itemsRenderLimit
                            ? (0, lodash_1.take)(filteredItems, itemsRenderLimit)
                            : filteredItems).map(function (item) { return ((0, jsx_runtime_1.jsx)(react_1.Combobox.Option, { value: item, className: function (_a) {
                                var active = _a.active, selected = _a.selected;
                                return (0, clsx_1.default)("flex gap-2", optionClassName && optionClassName({ active: active, selected: selected }));
                            }, children: function (_a) {
                                var selected = _a.selected, active = _a.active;
                                return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [selected ? ((0, jsx_runtime_1.jsx)("span", { className: (0, clsx_1.default)("flex items-center", active ? "text-white" : "text-primary-500"), children: (0, jsx_runtime_1.jsx)(solid_1.CheckIcon, { className: "h-5 w-5", "aria-hidden": "true" }) })) : null, doRender(item)] }));
                            } }, item._id)); }) })), open && emptyText && query !== "" && filteredItems.length === 0 && ((0, jsx_runtime_1.jsx)("p", { className: emptyTextClassName, children: emptyText }))] }));
        } }));
}
exports.default = UnstyledAutocomplete;
