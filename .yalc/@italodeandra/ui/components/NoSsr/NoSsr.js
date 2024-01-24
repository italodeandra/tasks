"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
function NoSsr(_a) {
    var children = _a.children;
    var _b = __read((0, react_1.useState)(false), 2), isMounted = _b[0], setIsMounted = _b[1];
    (0, react_1.useEffect)(function () {
        setIsMounted(true);
    }, []);
    return isMounted ? (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children }) : null;
}
exports.default = NoSsr;
