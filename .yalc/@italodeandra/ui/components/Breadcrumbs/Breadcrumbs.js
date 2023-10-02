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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var solid_1 = require("@heroicons/react/20/solid");
var clsx_1 = __importDefault(require("clsx"));
var Text_1 = __importDefault(require("../Text"));
var link_1 = __importDefault(require("next/link"));
var Loading_1 = __importDefault(require("../Loading"));
var Skeleton_1 = __importDefault(require("../Skeleton"));
function Breadcrumbs(_a) {
    var pages = _a.pages, _b = _a.homeHref, homeHref = _b === void 0 ? "/" : _b, className = _a.className, loading = _a.loading;
    if (!(pages === null || pages === void 0 ? void 0 : pages.length)) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)("nav", __assign({ className: (0, clsx_1.default)("flex", className), "aria-label": "Breadcrumb" }, { children: (0, jsx_runtime_1.jsxs)("ol", __assign({ role: "list", className: "flex w-full space-x-4 bg-white px-6 shadow dark:border-y dark:border-zinc-800 dark:bg-zinc-900 md:w-auto md:rounded-md md:dark:border-x" }, { children: [(0, jsx_runtime_1.jsx)("li", __assign({ className: "flex" }, { children: (0, jsx_runtime_1.jsx)("div", __assign({ className: "flex items-center" }, { children: (0, jsx_runtime_1.jsxs)(link_1.default, __assign({ href: homeHref, className: "text-gray-400 hover:text-gray-500 dark:hover:text-gray-200" }, { children: [(0, jsx_runtime_1.jsx)(solid_1.HomeIcon, { className: "h-5 w-5 flex-shrink-0", "aria-hidden": "true" }), (0, jsx_runtime_1.jsx)("span", __assign({ className: "sr-only" }, { children: "Home" }))] })) })) })), pages.map(function (page, i) {
                    var isLast = i === pages.length - 1;
                    return ((0, jsx_runtime_1.jsx)("li", __assign({ className: "flex" }, { children: (0, jsx_runtime_1.jsxs)("div", __assign({ className: "flex items-center" }, { children: [(0, jsx_runtime_1.jsx)("svg", __assign({ className: "h-full w-6 flex-shrink-0 text-gray-200 dark:text-zinc-800", viewBox: "0 0 24 44", preserveAspectRatio: "none", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true" }, { children: (0, jsx_runtime_1.jsx)("path", { d: "M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" }) })), (0, jsx_runtime_1.jsx)(Text_1.default, __assign({ href: !isLast ? page.href : undefined, className: (0, clsx_1.default)("ml-4 text-sm font-medium !text-gray-500 dark:!text-gray-400", {
                                        "cursor-default": isLast,
                                        "hover:!text-gray-700 dark:hover:!text-gray-200": !isLast,
                                    }), "aria-current": isLast ? "page" : undefined }, { children: page.loading ? ((0, jsx_runtime_1.jsx)(Skeleton_1.default, { className: "h-3 w-10" })) : (page.title) }))] })) }), page.title));
                }), loading && ((0, jsx_runtime_1.jsx)("li", __assign({ className: "!ml-auto mt-3" }, { children: (0, jsx_runtime_1.jsx)(Loading_1.default, { className: "ml-4 -mr-3" }) })))] })) })));
}
exports.default = Breadcrumbs;
