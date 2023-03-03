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
var Button_1 = __importDefault(require("../Button/Button"));
var next_seo_1 = require("next-seo");
function ErrorPage(_a) {
    var error = _a.error, _b = _a.background, background = _b === void 0 ? "https://images.unsplash.com/photo-1545972154-9bb223aac798?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3050&q=80&exp=8&con=-15&sat=-75" : _b, title = _a.title, description = _a.description, _c = _a.defaultActionLabel, defaultActionLabel = _c === void 0 ? "Go back home" : _c, _d = _a.defaultActionHref, defaultActionHref = _d === void 0 ? "/" : _d, _e = _a.action, action = _e === void 0 ? ((0, jsx_runtime_1.jsx)(Button_1.default, __assign({ variant: "text", href: defaultActionHref, className: "inline-flex items-center rounded-md border border-transparent bg-white bg-opacity-75 px-4 py-2 text-sm font-medium text-black text-opacity-75 sm:bg-opacity-25 sm:hover:bg-opacity-50" }, { children: defaultActionLabel }))) : _e;
    return ((0, jsx_runtime_1.jsxs)("main", __assign({ className: "min-h-full bg-slate-400 bg-cover bg-top sm:bg-top", style: {
            backgroundImage: "url(\"".concat(background, "\")"),
        } }, { children: [(0, jsx_runtime_1.jsx)(next_seo_1.NextSeo, { title: error.toString() }), (0, jsx_runtime_1.jsxs)("div", __assign({ className: "mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8 lg:py-48" }, { children: [(0, jsx_runtime_1.jsx)("p", __assign({ className: "text-base font-semibold text-black text-opacity-50" }, { children: error })), (0, jsx_runtime_1.jsx)("h1", __assign({ className: "mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl" }, { children: title })), (0, jsx_runtime_1.jsx)("p", __assign({ className: "mt-2 text-lg font-medium text-black text-opacity-50" }, { children: description })), (0, jsx_runtime_1.jsx)("div", __assign({ className: "mt-6" }, { children: action }))] }))] })));
}
exports.default = ErrorPage;
