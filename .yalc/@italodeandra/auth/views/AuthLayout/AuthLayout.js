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
var image_1 = __importDefault(require("next/image"));
var link_1 = __importDefault(require("next/link"));
var AuthContext_1 = require("../../AuthContext");
var ModeToggle_1 = require("@italodeandra/ui/components/ModeToggle/ModeToggle");
var GridPattern_1 = __importDefault(require("@italodeandra/ui/components/GridPattern/GridPattern"));
function AuthLayout(_a) {
    var title = _a.title, subtitle = _a.subtitle, children = _a.children, _b = _a.backgroundImage, backgroundImage = _b === void 0 ? "https://i.imgur.com/AEFv06G.jpg" : _b, backgroundDescription = _a.backgroundDescription;
    var Routes = (0, AuthContext_1.useAuthContext)().Routes;
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "flex min-h-screen bg-white dark:bg-zinc-900" }, { children: [(0, jsx_runtime_1.jsxs)("div", __assign({ className: "relative flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24" }, { children: [(0, jsx_runtime_1.jsx)("div", __assign({ className: "absolute inset-0 text-slate-900/[0.07] [mask-image:linear-gradient(to_bottom_left,white,transparent,transparent)] dark:text-slate-100/[0.07]" }, { children: (0, jsx_runtime_1.jsx)(GridPattern_1.default, { x: "100%", patternTransform: "translate(0 -1)" }) })), (0, jsx_runtime_1.jsxs)("div", __assign({ className: "z-10 mx-auto w-full max-w-sm lg:w-96" }, { children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(link_1.default, __assign({ href: Routes.Home }, { children: (0, jsx_runtime_1.jsx)(image_1.default, { src: "/favicon.ico", width: 48, height: 48, alt: "Logo" }) })), (0, jsx_runtime_1.jsx)("h2", __assign({ className: "mt-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100" }, { children: title })), subtitle && ((0, jsx_runtime_1.jsx)("p", __assign({ className: "mt-2 text-sm text-zinc-600 dark:text-zinc-400" }, { children: subtitle })))] }), (0, jsx_runtime_1.jsxs)("div", __assign({ className: "mt-8" }, { children: [(0, jsx_runtime_1.jsx)("div", __assign({ className: "mt-6" }, { children: children })), (0, jsx_runtime_1.jsx)("div", __assign({ className: "mt-2 flex justify-center" }, { children: (0, jsx_runtime_1.jsx)(ModeToggle_1.ModeToggle, {}) }))] }))] }))] })), (0, jsx_runtime_1.jsxs)("div", __assign({ className: "relative hidden w-0 flex-1 lg:block" }, { children: [(0, jsx_runtime_1.jsx)(image_1.default, { className: "absolute inset-0 h-full w-full object-cover", src: backgroundImage, alt: "", fill: true }), backgroundDescription && ((0, jsx_runtime_1.jsx)("div", __assign({ className: "absolute right-2 bottom-2 rounded bg-white/30 px-1 py-0.5 text-xs font-medium" }, { children: backgroundDescription })))] }))] })));
}
exports.default = AuthLayout;
