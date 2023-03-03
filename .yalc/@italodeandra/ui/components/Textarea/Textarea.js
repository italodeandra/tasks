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
var Input_1 = __importDefault(require("../Input/Input"));
var react_textarea_autosize_1 = __importDefault(require("react-textarea-autosize"));
var react_1 = require("react");
function Textarea(props, ref) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (0, jsx_runtime_1.jsx)(Input_1.default, __assign({ as: react_textarea_autosize_1.default }, props, { ref: ref }));
}
exports.default = (0, react_1.forwardRef)(Textarea);
