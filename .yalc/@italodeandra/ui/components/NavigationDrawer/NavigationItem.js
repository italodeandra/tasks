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
var clsx_1 = __importDefault(require("clsx"));
var router_1 = require("next/dist/client/router");
var react_1 = require("react");
var react_use_1 = require("react-use");
var Button_1 = __importDefault(require("../Button"));
var navigationDrawer_state_1 = __importDefault(require("./navigationDrawer.state"));
var defaultTheme_1 = __importDefault(require("tailwindcss/defaultTheme"));
function NavigationItem(_a) {
    var _b;
    var icon = _a.icon, children = _a.children, href = _a.href, exact = _a.exact, alternativeActiveHrefs = _a.alternativeActiveHrefs;
    var router = (0, router_1.useRouter)();
    var active = exact
        ? router.pathname === href ||
            (alternativeActiveHrefs === null || alternativeActiveHrefs === void 0 ? void 0 : alternativeActiveHrefs.some(function (href) { return router.pathname === href; }))
        : router.pathname.includes(href) ||
            (alternativeActiveHrefs === null || alternativeActiveHrefs === void 0 ? void 0 : alternativeActiveHrefs.some(function (href) { return router.pathname.includes(href); }));
    var isMobile = (0, react_use_1.useMedia)("(max-width: ".concat(defaultTheme_1.default.screens.lg, ")"), false);
    return ((0, jsx_runtime_1.jsx)(Button_1.default, __assign({ variant: active ? "light" : "text", className: (0, clsx_1.default)("w-full !justify-start !border-transparent"), leading: icon &&
            (0, react_1.cloneElement)(icon, {
                className: (0, clsx_1.default)((_b = icon.props) === null || _b === void 0 ? void 0 : _b.className, "!w-5 mr-3"),
            }), href: href, onClick: isMobile ? navigationDrawer_state_1.default.close : undefined }, { children: children })));
}
exports.default = NavigationItem;
