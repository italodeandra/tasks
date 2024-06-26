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
var link_1 = __importDefault(require("next/link"));
var UnstyledButton = function (_a, ref) {
    var href = _a.href, as = _a.as, props = __rest(_a, ["href", "as"]);
    if (as) {
        var Component = as;
        return ((0, jsx_runtime_1.jsx)(Component, __assign({}, props, { ref: ref })));
    }
    if (href) {
        var props2 = props;
        return ((0, jsx_runtime_1.jsx)(link_1.default, __assign({}, props2, { href: href, ref: ref, tabIndex: props2.disabled ? -1 : undefined })));
    }
    return ((0, jsx_runtime_1.jsx)("button", __assign({}, props, { ref: ref })));
};
exports.default = (0, react_1.forwardRef)(UnstyledButton);
