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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var lodash_1 = require("lodash");
function useTranslation(intl, prePath) {
    return (0, react_1.useCallback)(function (sentence, path) {
        return ((0, lodash_1.get)(intl, __spreadArray(__spreadArray(__spreadArray([], __read(((prePath === null || prePath === void 0 ? void 0 : prePath.split(".")) || [])), false), __read(((path === null || path === void 0 ? void 0 : path.split(".")) || [])), false), [
            sentence,
        ], false).filter(Boolean)) || sentence);
    }, [intl, prePath]);
}
exports.default = useTranslation;
