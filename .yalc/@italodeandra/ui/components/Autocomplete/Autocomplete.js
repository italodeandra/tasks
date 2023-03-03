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
var react_1 = require("react");
var clsx_1 = __importDefault(require("clsx"));
var UnstyledAutocomplete_1 = __importDefault(require("../Autocomplete/UnstyledAutocomplete"));
var Input_1 = __importDefault(require("../Input/Input"));
var Menu_1 = require("../Menu/Menu");
function Autocomplete(_a) {
    var _b = _a.query, defaultQuery = _b === void 0 ? "" : _b, onChangeQuery = _a.onChangeQuery, _c = _a.emptyText, emptyText = _c === void 0 ? "No item found." : _c, props = __rest(_a, ["query", "onChangeQuery", "emptyText"]);
    var _d = __read((0, react_1.useState)(defaultQuery), 2), query = _d[0], setQuery = _d[1];
    (0, react_1.useEffect)(function () {
        if (query !== defaultQuery) {
            setQuery(defaultQuery);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultQuery]);
    (0, react_1.useEffect)(function () {
        if (onChangeQuery && query !== defaultQuery) {
            onChangeQuery(query);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onChangeQuery, query]);
    return ((0, jsx_runtime_1.jsx)("div", __assign({ className: "relative" }, { children: (0, jsx_runtime_1.jsx)(UnstyledAutocomplete_1.default, __assign({}, props, { as: Input_1.default, query: query, onChangeQuery: setQuery, emptyTextClassName: (0, clsx_1.default)(Menu_1.defaultMenuItemsClassName, "p-4 text-sm text-gray-500 dark:text-zinc-400 mt-1 absolute w-full"), optionsClassName: (0, clsx_1.default)(Menu_1.defaultMenuItemsClassName, "max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-800 dark:text-zinc-200 absolute z-10 mt-1 w-full"), optionClassName: function (_a) {
                var active = _a.active;
                return (0, clsx_1.default)("cursor-default select-none px-4 py-2", active && "bg-primary-600 text-white");
            }, emptyText: emptyText })) })));
}
exports.default = Autocomplete;
