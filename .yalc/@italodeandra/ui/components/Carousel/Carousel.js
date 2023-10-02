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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var solid_1 = require("@heroicons/react/20/solid");
var embla_carousel_react_1 = __importDefault(require("embla-carousel-react"));
var clsx_1 = __importDefault(require("clsx"));
var react_1 = require("react");
var Button_1 = __importDefault(require("../Button"));
var react_use_1 = require("react-use");
var react_merge_refs_1 = __importDefault(require("react-merge-refs"));
function Carousel(_a) {
    var children = _a.children, className = _a.className, carouselClassName = _a.carouselClassName, navigation = _a.navigation, options = __rest(_a, ["children", "className", "carouselClassName", "navigation"]);
    var _b = __read((0, embla_carousel_react_1.default)(options), 2), emblaRef = _b[0], embla = _b[1];
    var _c = __read((0, react_1.useState)(false), 2), canScrollPrev = _c[0], setCanScrollPrev = _c[1];
    var _d = __read((0, react_1.useState)(false), 2), canScrollNext = _d[0], setCanScrollNext = _d[1];
    var _e = __read((0, react_use_1.useMeasure)(), 2), ref = _e[0], _f = _e[1], width = _f.width, height = _f.height;
    (0, react_1.useEffect)(function () {
        function updateCanScroll() {
            if (embla) {
                setCanScrollPrev(embla.canScrollPrev());
                setCanScrollNext(embla.canScrollNext());
            }
        }
        if (embla) {
            embla.reInit();
            updateCanScroll();
            embla.on("select", updateCanScroll);
            embla.on("reInit", updateCanScroll);
        }
        return function () {
            if (embla) {
                embla.off("select", updateCanScroll);
                embla.off("reInit", updateCanScroll);
            }
        };
    }, [embla, width, height]);
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: (0, clsx_1.default)("overflow-hidden", className), ref: (0, react_merge_refs_1.default)([ref, emblaRef]) }, { children: [(0, jsx_runtime_1.jsx)("div", __assign({ className: (0, clsx_1.default)("flex", carouselClassName) }, { children: children })), navigation && ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "flex h-full" }, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, __assign({ icon: true, variant: "text", className: (0, clsx_1.default)({
                            hidden: !canScrollPrev,
                        }), disabled: !canScrollPrev, onClick: function () { return embla === null || embla === void 0 ? void 0 : embla.scrollPrev(); } }, { children: (0, jsx_runtime_1.jsx)(solid_1.ChevronLeftIcon, {}) })), (0, jsx_runtime_1.jsx)("div", { className: "flex-grow" }), (0, jsx_runtime_1.jsx)(Button_1.default, __assign({ icon: true, variant: "text", className: (0, clsx_1.default)({
                            hidden: !canScrollNext,
                        }), disabled: !canScrollNext, onClick: function () { return embla === null || embla === void 0 ? void 0 : embla.scrollNext(); } }, { children: (0, jsx_runtime_1.jsx)(solid_1.ChevronRightIcon, {}) }))] })))] })));
}
exports.default = Carousel;
Carousel.Slide = CarouselSlide;
function CarouselSlide(_a) {
    var children = _a.children, className = _a.className;
    return ((0, jsx_runtime_1.jsx)("div", __assign({ className: (0, clsx_1.default)("min-w-0 flex-[0_0_auto]", className) }, { children: children })));
}
