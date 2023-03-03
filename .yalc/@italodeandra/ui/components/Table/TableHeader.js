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
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
function TableHeader(_a) {
    var title = _a.title, subtitle = _a.subtitle, children = _a.children;
    return ((0, jsx_runtime_1.jsx)("div", __assign({ className: "px-4 md:px-0" }, { children: (0, jsx_runtime_1.jsxs)("div", __assign({ className: "sm:flex sm:items-center" }, { children: [title ||
                    (subtitle && ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "sm:flex-auto" }, { children: [title && ((0, jsx_runtime_1.jsx)("h1", __assign({ className: "text-xl font-semibold text-gray-900 dark:text-white" }, { children: title }))), subtitle && ((0, jsx_runtime_1.jsx)("p", __assign({ className: "mt-2 text-sm text-zinc-700 dark:text-zinc-300" }, { children: subtitle })))] })))), children && ((0, jsx_runtime_1.jsx)("div", __assign({ className: "mt-4 sm:mt-0 sm:ml-16 sm:flex-none" }, { children: children })))] })) })));
}
exports.default = TableHeader;
