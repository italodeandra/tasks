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
function TableRow(_a) {
    var children = _a.children, onClick = _a.onClick;
    return ((0, jsx_runtime_1.jsx)("tr", __assign({ onClick: onClick, className: (0, clsx_1.default)({
            "cursor-pointer hover:bg-black/5 dark:hover:bg-white/5": !!onClick,
        }) }, { children: children })));
}
exports.default = TableRow;
