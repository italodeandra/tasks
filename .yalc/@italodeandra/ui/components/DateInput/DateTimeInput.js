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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var Input_1 = __importDefault(require("../Input"));
var solid_1 = require("@heroicons/react/20/solid");
var useRefValue_1 = require("./useRefValue");
function DateTimeInput(_a, ref) {
    var readOnly = _a.readOnly, props = __rest(_a, ["readOnly"]);
    var realRef = (0, useRefValue_1.useRefValue)(ref);
    return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, props, { ref: realRef, type: "datetime-local", pattern: "[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}", trailing: !readOnly ? (0, jsx_runtime_1.jsx)(solid_1.CalendarIcon, { className: "w-5" }) : undefined, inputClassName: "!pr-3", readOnly: readOnly })));
}
exports.default = (0, react_1.forwardRef)(DateTimeInput);
