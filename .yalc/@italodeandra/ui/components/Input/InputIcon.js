"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var clsx_1 = __importDefault(require("../../utils/clsx"));
function InputIcon(_a) {
    var className = _a.className, children = _a.children;
    return (0, react_1.cloneElement)(children, {
        className: (0, clsx_1.default)("h-5 w-5", className),
    });
}
exports.default = InputIcon;
