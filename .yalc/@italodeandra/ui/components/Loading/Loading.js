"use strict";
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
var clsx_1 = __importDefault(require("../../utils/clsx"));
var Group_1 = __importDefault(require("../Group"));
var react_1 = require("react");
var ms_1 = __importDefault(require("ms"));
function Loading(_a) {
    var className = _a.className, dotClassName = _a.dotClassName, debounce = _a.debounce;
    var _b = __read((0, react_1.useState)(false), 2), shouldRender = _b[0], setShouldRender = _b[1];
    (0, react_1.useEffect)(function () {
        if (debounce) {
            setTimeout(function () {
                setShouldRender(true);
            }, (0, ms_1.default)(typeof debounce === "string" ? debounce : "1s"));
        }
        else {
            setShouldRender(true);
        }
    }, [debounce]);
    dotClassName = (0, clsx_1.default)("bg-[currentColor] w-1 h-1 rounded-full shrink-0", dotClassName);
    if (!shouldRender) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)(Group_1.default, { className: (0, clsx_1.default)("gap-0.5 opacity-20 transition items-center justify-center", className), children: [(0, jsx_runtime_1.jsx)("div", { className: (0, clsx_1.default)("animate-[pulsehide_2s_cubic-bezier(0.4,0,0.6,1)_infinite]", dotClassName) }), (0, jsx_runtime_1.jsx)("div", { className: (0, clsx_1.default)("animate-[pulsehide_2s_cubic-bezier(0.4,0,0.6,1)_infinite_300ms]", dotClassName) }), (0, jsx_runtime_1.jsx)("div", { className: (0, clsx_1.default)("animate-[pulsehide_2s_cubic-bezier(0.4,0,0.6,1)_infinite_600ms]", dotClassName) })] }));
}
exports.default = Loading;
