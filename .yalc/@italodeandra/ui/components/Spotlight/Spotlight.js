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
var react_2 = require("@headlessui/react");
var clsx_1 = __importDefault(require("clsx"));
var Autocomplete_1 = require("../Autocomplete");
var Input_1 = require("../Input");
var solid_1 = require("@heroicons/react/20/solid");
function Spotlight(_a) {
    var open = _a.open, onClose = _a.onClose, _b = _a.placeholder, placeholder = _b === void 0 ? "Search..." : _b, _c = _a.query, defaultQuery = _c === void 0 ? "" : _c, onChangeQuery = _a.onChangeQuery, _d = _a.emptyText, emptyText = _d === void 0 ? "No item found." : _d, props = __rest(_a, ["open", "onClose", "placeholder", "query", "onChangeQuery", "emptyText"]);
    var _e = __read((0, react_1.useState)(defaultQuery), 2), query = _e[0], setQuery = _e[1];
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
    var handleOnClose = (0, react_1.useCallback)(function () { return onClose === null || onClose === void 0 ? void 0 : onClose(); }, [onClose]);
    return ((0, jsx_runtime_1.jsx)(react_2.Transition.Root, __assign({ show: open, as: react_1.Fragment, afterLeave: function () { return setQuery(""); }, appear: true }, { children: (0, jsx_runtime_1.jsxs)(react_2.Dialog, __assign({ as: "div", className: "relative z-10", onClose: handleOnClose }, { children: [(0, jsx_runtime_1.jsx)(react_2.Transition.Child, __assign({ as: react_1.Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0", enterTo: "opacity-100", leave: "ease-in duration-200", leaveFrom: "opacity-100", leaveTo: "opacity-0" }, { children: (0, jsx_runtime_1.jsx)("div", { className: (0, clsx_1.default)("fixed inset-0 bg-gray-500 !bg-opacity-25 transition-opacity dark:bg-zinc-800", "bg-white/50 backdrop-blur [@supports(backdrop-filter:blur(0))]:bg-white/30", "dark:bg-zinc-900/50 dark:[@supports(backdrop-filter:blur(0))]:bg-zinc-900/30") }) })), (0, jsx_runtime_1.jsx)("div", __assign({ className: "fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20" }, { children: (0, jsx_runtime_1.jsx)(react_2.Transition.Child, __assign({ as: react_1.Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0 scale-95", enterTo: "opacity-100 scale-100", leave: "ease-in duration-200", leaveFrom: "opacity-100 scale-100", leaveTo: "opacity-0 scale-95" }, { children: (0, jsx_runtime_1.jsx)(react_2.Dialog.Panel, __assign({ className: "mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-10 transition-all dark:divide-zinc-800 dark:bg-zinc-900 dark:ring-1 dark:ring-white/5" }, { children: (0, jsx_runtime_1.jsx)(Autocomplete_1.UnstyledAutocomplete, __assign({}, props, { query: query, onChangeQuery: setQuery, placeholder: placeholder, leadingClassName: Input_1.defaultLeadingClassName, inputElementClassName: "h-12 border-0 focus:ring-0", leading: (0, jsx_runtime_1.jsx)(Input_1.InputIcon, { children: (0, jsx_runtime_1.jsx)(solid_1.MagnifyingGlassIcon, { "aria-hidden": "true" }) }), emptyTextClassName: "p-4 text-sm text-gray-500 dark:text-zinc-400", optionsClassName: "max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-800 dark:text-zinc-200", optionClassName: function (_a) {
                                    var active = _a.active;
                                    return (0, clsx_1.default)("cursor-default select-none px-4 py-2", active && "bg-primary-600 text-white");
                                }, emptyText: emptyText })) })) })) }))] })) })));
}
exports.default = Spotlight;
