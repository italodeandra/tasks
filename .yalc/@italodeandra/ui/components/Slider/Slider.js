"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var RSlider = __importStar(require("@radix-ui/react-slider"));
var fakeArray_1 = __importDefault(require("../../utils/fakeArray"));
var clsx_1 = __importDefault(require("../../utils/clsx"));
var react_use_1 = require("react-use");
function Slider(_a) {
    var _b = _a.step, step = _b === void 0 ? 1 : _b, _c = _a.max, max = _c === void 0 ? 100 : _c, _d = _a.min, min = _d === void 0 ? 0 : _d, className = _a.className, value = _a.value, onValueChange = _a.onValueChange, thumbClassName = _a.thumbClassName;
    var thumbs = (value === null || value === void 0 ? void 0 : value.length) || 1;
    var _e = __read((0, react_1.useState)((0, fakeArray_1.default)(thumbs).map(function (n) { return 10 * n; })), 2), intervalValue = _e[0], setInternalValue = _e[1];
    (0, react_use_1.useUpdateEffect)(function () {
        setInternalValue(value || (0, fakeArray_1.default)(thumbs).map(function (n) { return 10 * n; }));
    }, [value]);
    (0, react_use_1.useUpdateEffect)(function () {
        onValueChange === null || onValueChange === void 0 ? void 0 : onValueChange(intervalValue);
    }, [intervalValue, onValueChange]);
    return ((0, jsx_runtime_1.jsxs)(RSlider.Root, { className: (0, clsx_1.default)("relative flex items-center select-none touch-none h-5", className), value: intervalValue, max: max, onValueChange: setInternalValue, step: step, min: min, children: [(0, jsx_runtime_1.jsx)(RSlider.Track, { className: "bg-black/30 relative grow rounded-full h-[3px]", children: (0, jsx_runtime_1.jsx)(RSlider.Range, { className: "absolute bg-primary-500 rounded-full h-full" }) }), (0, fakeArray_1.default)(thumbs).map(function (n) { return ((0, jsx_runtime_1.jsx)(RSlider.Thumb, { className: (0, clsx_1.default)("transition block w-5 h-5 bg-white shadow-md rounded-full hover:bg-primary-500 focus:outline-none focus-visible:ring-2 ring-offset-2 ring-offset-zinc-100 ring-primary-500 focus-visible:shadow-lg", thumbClassName) }, n)); })] }));
}
exports.default = Slider;
