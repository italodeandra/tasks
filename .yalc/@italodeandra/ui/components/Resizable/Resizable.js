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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resizable = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_use_1 = require("react-use");
var clsx_1 = __importDefault(require("clsx"));
function Resizable(_a) {
    var children = _a.children, minWidth = _a.minWidth, maxWidth = _a.maxWidth, width = _a.width, onResize = _a.onResize;
    var _b = __read((0, react_1.useState)(width), 2), internalWidth = _b[0], setInternalWidth = _b[1];
    var _c = __read((0, react_1.useState)(false), 2), isResizing = _c[0], setResizing = _c[1];
    var isResizingRef = (0, react_use_1.useLatest)(isResizing);
    var initialMouseXPos = (0, react_1.useRef)(0);
    var initialWidth = (0, react_1.useRef)(0);
    (0, react_1.useEffect)(function () {
        onResize(internalWidth);
    }, [internalWidth, onResize]);
    var onMouseDown = function (e) {
        var _a;
        var parent = (_a = e.currentTarget) === null || _a === void 0 ? void 0 : _a.parentNode;
        var rect = parent.getBoundingClientRect();
        initialWidth.current = rect.width;
        initialMouseXPos.current = e.clientX;
        setResizing(true);
    };
    (0, react_1.useEffect)(function () {
        var onMouseMove = function (e) {
            if (isResizingRef.current) {
                var newWidth = initialWidth.current - (e.clientX - initialMouseXPos.current);
                if (minWidth !== undefined && newWidth < minWidth) {
                    newWidth = minWidth;
                }
                if (maxWidth !== undefined && newWidth > maxWidth) {
                    newWidth = maxWidth;
                }
                setInternalWidth(newWidth);
            }
        };
        var onMouseUp = function () {
            setResizing(false);
        };
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        return function () {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [isResizingRef, maxWidth, minWidth, onResize]);
    return (0, react_1.cloneElement)(children, {
        className: (0, clsx_1.default)("relative", children.props.className),
        style: { width: internalWidth },
        children: ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: (0, clsx_1.default)("absolute left-0 top-0 bottom-0 z-10 w-1 cursor-e-resize select-none transition-colors hover:bg-zinc-700", {
                        "bg-zinc-700": isResizing,
                    }), onMouseDown: onMouseDown }), children.props.children] })),
    });
}
exports.Resizable = Resizable;
