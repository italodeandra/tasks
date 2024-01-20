"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var CURRENT_YEAR = new Date().getFullYear();
function Footer(_a) {
    var main = _a.main, social = _a.social, companyName = _a.companyName, _b = _a.allRightsReserved, allRightsReserved = _b === void 0 ? "All rights reserved" : _b, children = _a.children;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "flex min-h-screen flex-col flex-col", children: children }), (0, jsx_runtime_1.jsx)("footer", { className: "border-t border-slate-900/5 bg-white dark:border-slate-50/5 dark:bg-zinc-900", children: (0, jsx_runtime_1.jsxs)("div", { className: "mx-auto max-w-7xl overflow-hidden px-4 py-12 sm:px-6 lg:px-8", children: [main && ((0, jsx_runtime_1.jsx)("nav", { className: "-mx-5 -my-2 mb-8 flex flex-wrap justify-center", "aria-label": "Footer", children: main.map(function (item) { return ((0, jsx_runtime_1.jsx)("div", { className: "px-5 py-2", children: (0, jsx_runtime_1.jsx)("a", { href: item.href, className: "text-base text-zinc-500 hover:text-zinc-900", children: item.name }) }, item.name)); }) })), social && ((0, jsx_runtime_1.jsx)("div", { className: "mb-8 flex justify-center space-x-6", children: social.map(function (item) { return ((0, jsx_runtime_1.jsxs)("a", { href: item.href, className: "text-zinc-400 hover:text-zinc-500", children: [(0, jsx_runtime_1.jsx)("span", { className: "sr-only", children: item.name }), (0, react_1.cloneElement)(item.icon, {
                                        className: "h-6 w-6",
                                        "aria-hidden": "true",
                                    })] }, item.name)); }) })), (0, jsx_runtime_1.jsxs)("p", { className: "text-center text-base text-zinc-400", children: [companyName, " \u00A9 ", CURRENT_YEAR, ". ", allRightsReserved, "."] })] }) })] }));
}
exports.default = Footer;
