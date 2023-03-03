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
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
function GridPattern(props) {
    var patternId = (0, react_1.useId)();
    return ((0, jsx_runtime_1.jsxs)("svg", __assign({ "aria-hidden": "true", className: "absolute inset-0 h-full w-full" }, { children: [(0, jsx_runtime_1.jsx)("defs", { children: (0, jsx_runtime_1.jsx)("pattern", __assign({ id: patternId, width: "32", height: "32", patternUnits: "userSpaceOnUse" }, props, { children: (0, jsx_runtime_1.jsx)("path", { d: "M0 32V.5H32", fill: "none", stroke: "currentColor" }) })) }), (0, jsx_runtime_1.jsx)("rect", { width: "100%", height: "100%", fill: "url(#".concat(patternId, ")") })] })));
}
exports.default = GridPattern;
