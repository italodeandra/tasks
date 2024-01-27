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
exports.useScrollYMovement = exports.useScrollY = exports.useIsScrolled = void 0;
var react_1 = require("react");
var isBrowser_1 = require("../utils/isBrowser");
// noinspection JSUnusedGlobalSymbols
function useIsScrolled(disabled) {
    return useScrollY(disabled) > 0;
}
exports.useIsScrolled = useIsScrolled;
function useScrollY(disabled) {
    var _a = __read((0, react_1.useState)(isBrowser_1.isBrowser ? window.scrollY : 0), 2), scrollY = _a[0], setScrollY = _a[1];
    (0, react_1.useEffect)(function () {
        function onScroll() {
            setScrollY(window.scrollY);
        }
        if (!disabled) {
            onScroll();
            window.addEventListener("scroll", onScroll, { passive: true });
            return function () {
                window.removeEventListener("scroll", onScroll);
            };
        }
    }, [disabled]);
    return scrollY;
}
exports.useScrollY = useScrollY;
function useScrollYMovement(max, callback, disabled) {
    if (max === void 0) { max = Infinity; }
    var scrollYMovement = (0, react_1.useRef)(0);
    var previousScrollYMovement = (0, react_1.useRef)(0);
    (0, react_1.useEffect)(function () {
        function onScroll() {
            var movement = window.scrollY - previousScrollYMovement.current;
            scrollYMovement.current = scrollYMovement.current + movement;
            scrollYMovement.current =
                scrollYMovement.current > max
                    ? max
                    : scrollYMovement.current < 0 || window.scrollY <= 0
                        ? 0
                        : scrollYMovement.current;
            callback(scrollYMovement.current);
            previousScrollYMovement.current = window.scrollY;
        }
        if (!disabled) {
            onScroll();
            window.addEventListener("scroll", onScroll, { passive: true });
            return function () {
                window.removeEventListener("scroll", onScroll);
            };
        }
    }, [callback, max, disabled]);
}
exports.useScrollYMovement = useScrollYMovement;
