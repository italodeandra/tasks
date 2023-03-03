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
function TopBlurryPoint() {
    return ((0, jsx_runtime_1.jsx)("div", __assign({ className: "pointer-events-none absolute inset-x-0 top-[-10rem] z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]" }, { children: (0, jsx_runtime_1.jsxs)("svg", __assign({ className: "relative left-[calc(50%-11rem)] z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]", viewBox: "0 0 1155 678", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, { children: [(0, jsx_runtime_1.jsx)("path", { fill: "url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)", fillOpacity: ".3", d: "M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z" }), (0, jsx_runtime_1.jsx)("defs", { children: (0, jsx_runtime_1.jsxs)("linearGradient", __assign({ id: "45de2b6b-92d5-4d68-a6a0-9b9b2abad533", x1: "1155.49", x2: "-78.208", y1: ".177", y2: "474.645", gradientUnits: "userSpaceOnUse" }, { children: [(0, jsx_runtime_1.jsx)("stop", { stopColor: "#9089FC" }), (0, jsx_runtime_1.jsx)("stop", { offset: 1, stopColor: "#FF80B5" })] })) })] })) })));
}
exports.default = TopBlurryPoint;
