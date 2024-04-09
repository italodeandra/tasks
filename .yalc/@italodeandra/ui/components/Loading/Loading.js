"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
function Loading(_a) {
    var className = _a.className;
    return ((0, jsx_runtime_1.jsxs)("svg", { xmlns: "http://www.w3.org/2000/svg", width: "1em", height: "1em", viewBox: "0 0 24 24", className: className, children: [(0, jsx_runtime_1.jsx)("circle", { cx: "4", cy: "12", r: "3", fill: "currentColor", children: (0, jsx_runtime_1.jsx)("animate", { id: "svgSpinners3DotsFade0", fill: "freeze", attributeName: "opacity", begin: "0;svgSpinners3DotsFade1.end-0.5s", dur: "1.5s", values: "1;0.2" }) }), (0, jsx_runtime_1.jsx)("circle", { cx: "12", cy: "12", r: "3", fill: "currentColor", opacity: "0.4", children: (0, jsx_runtime_1.jsx)("animate", { fill: "freeze", attributeName: "opacity", begin: "svgSpinners3DotsFade0.begin+0.3s", dur: "1.5s", values: "1;0.2" }) }), (0, jsx_runtime_1.jsx)("circle", { cx: "20", cy: "12", r: "3", fill: "currentColor", opacity: "0.3", children: (0, jsx_runtime_1.jsx)("animate", { id: "svgSpinners3DotsFade1", fill: "freeze", attributeName: "opacity", begin: "svgSpinners3DotsFade0.begin+0.6s", dur: "1.5s", values: "1;0.2" }) })] }));
}
exports.default = Loading;
