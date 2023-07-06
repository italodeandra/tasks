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
var react_1 = require("react");
var CURRENT_YEAR = new Date().getFullYear();
function Footer(_a) {
    var main = _a.main, social = _a.social, companyName = _a.companyName, _b = _a.allRightsReserved, allRightsReserved = _b === void 0 ? "All rights reserved" : _b, children = _a.children;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", __assign({ className: "flex min-h-screen flex-col flex-col" }, { children: children })), (0, jsx_runtime_1.jsx)("footer", __assign({ className: "border-t border-slate-900/5 bg-white dark:border-slate-50/5 dark:bg-zinc-900" }, { children: (0, jsx_runtime_1.jsxs)("div", __assign({ className: "mx-auto max-w-7xl overflow-hidden py-12 px-4 sm:px-6 lg:px-8" }, { children: [main && ((0, jsx_runtime_1.jsx)("nav", __assign({ className: "-mx-5 -my-2 mb-8 flex flex-wrap justify-center", "aria-label": "Footer" }, { children: main.map(function (item) { return ((0, jsx_runtime_1.jsx)("div", __assign({ className: "px-5 py-2" }, { children: (0, jsx_runtime_1.jsx)("a", __assign({ href: item.href, className: "text-base text-gray-500 hover:text-gray-900" }, { children: item.name })) }), item.name)); }) }))), social && ((0, jsx_runtime_1.jsx)("div", __assign({ className: "mb-8 flex justify-center space-x-6" }, { children: social.map(function (item) { return ((0, jsx_runtime_1.jsxs)("a", __assign({ href: item.href, className: "text-gray-400 hover:text-gray-500" }, { children: [(0, jsx_runtime_1.jsx)("span", __assign({ className: "sr-only" }, { children: item.name })), (0, react_1.cloneElement)(item.icon, {
                                        className: "h-6 w-6",
                                        "aria-hidden": "true",
                                    })] }), item.name)); }) }))), (0, jsx_runtime_1.jsxs)("p", __assign({ className: "text-center text-base text-gray-400" }, { children: [companyName, " \u00A9 ", CURRENT_YEAR, ". ", allRightsReserved, "."] }))] })) }))] }));
}
exports.default = Footer;
