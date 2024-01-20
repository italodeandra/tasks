"use strict";
// noinspection JSDeprecatedSymbols
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
var react_1 = require("react");
function useMediaQuery(query) {
    var getMatches = function (query) {
        // Prevents SSR issues
        if (typeof window !== "undefined") {
            return window.matchMedia(query).matches;
        }
        return false;
    };
    var _a = __read((0, react_1.useState)(getMatches(query)), 2), matches = _a[0], setMatches = _a[1];
    function handleChange() {
        setMatches(getMatches(query));
    }
    (0, react_1.useEffect)(function () {
        var matchMedia = window.matchMedia(query);
        // Triggered at the first client-side load and if query changes
        handleChange();
        // Listen matchMedia
        if (matchMedia.addListener) {
            matchMedia.addListener(handleChange);
        }
        else {
            matchMedia.addEventListener("change", handleChange);
        }
        return function () {
            if (matchMedia.removeListener) {
                matchMedia.removeListener(handleChange);
            }
            else {
                matchMedia.removeEventListener("change", handleChange);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);
    return matches;
}
exports.default = useMediaQuery;
