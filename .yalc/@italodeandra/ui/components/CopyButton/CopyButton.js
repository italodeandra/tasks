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
var outline_1 = require("@heroicons/react/24/outline");
var Button_1 = __importDefault(require("../Button/Button"));
function CopyButton(_a) {
    var text = _a.text, _b = _a.copyText, copyText = _b === void 0 ? "Copy" : _b, _c = _a.copiedText, copiedText = _c === void 0 ? "Copied!" : _c;
    var _d = __read((0, react_1.useState)(0), 2), copyCount = _d[0], setCopyCount = _d[1];
    var copied = copyCount > 0;
    (0, react_1.useEffect)(function () {
        if (copyCount > 0) {
            var timeout_1 = setTimeout(function () { return setCopyCount(0); }, 1000);
            return function () {
                clearTimeout(timeout_1);
            };
        }
    }, [copyCount]);
    return ((0, jsx_runtime_1.jsxs)(Button_1.default, __assign({ type: "button", color: copied ? "success" : undefined, size: "sm", className: "absolute top-2.5 right-2.5 opacity-0 backdrop-blur focus:opacity-100 group-hover:opacity-100", onClick: function () {
            window.navigator.clipboard.writeText(text).then(function () {
                setCopyCount(function (count) { return count + 1; });
            });
        }, rounded: true }, { children: [(0, jsx_runtime_1.jsxs)("span", __assign({ "aria-hidden": copied, className: (0, clsx_1.default)("pointer-events-none flex items-center gap-0.5 transition-[transform,opacity]", copied && "-translate-y-1.5 opacity-0") }, { children: [(0, jsx_runtime_1.jsx)(outline_1.ClipboardIcon, { className: "mr-2 h-4 w-4" }), copyText] })), (0, jsx_runtime_1.jsx)("span", __assign({ "aria-hidden": !copied, className: (0, clsx_1.default)("pointer-events-none absolute inset-0 flex items-center justify-center transition-[transform,opacity]", !copied && "translate-y-1.5 opacity-0") }, { children: copiedText }))] })));
}
exports.default = CopyButton;
