"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var clsx_1 = __importDefault(require("../../utils/clsx"));
function Loading(_a) {
    var className = _a.className;
    return ((0, jsx_runtime_1.jsxs)("svg", { className: (0, clsx_1.default)("animate-spin", {
            "h-5": !(className === null || className === void 0 ? void 0 : className.includes("h-")),
            "w-5": !(className === null || className === void 0 ? void 0 : className.includes("w-")),
            "text-zinc-400": !(className === null || className === void 0 ? void 0 : className.includes("text-")),
        }, className), xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [(0, jsx_runtime_1.jsx)("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), (0, jsx_runtime_1.jsx)("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }));
}
exports.default = Loading;
