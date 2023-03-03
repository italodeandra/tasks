"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_use_1 = require("react-use");
function useLagRadar() {
    var _a = (0, react_use_1.useWindowSize)(), width = _a.width, height = _a.height;
    react_1.default.useEffect(function () {
        return lagRadar({
            frames: 60,
            speed: 0.0017,
            size: Math.min(width, height) / 3,
            inset: 3,
            parent: document.body, // DOM node to attach to
        });
    }, [width, height]);
}
exports.default = useLagRadar;
function lagRadar(config) {
    if (config === void 0) { config = {}; }
    var _a = config.frames, frames = _a === void 0 ? 50 : _a, // number of frames to draw, more = worse performance
    _b = config.speed, // number of frames to draw, more = worse performance
    speed = _b === void 0 ? 0.0017 : _b, // how fast the sweep moves (rads per ms)
    _c = config.size, // how fast the sweep moves (rads per ms)
    size = _c === void 0 ? 300 : _c, // outer frame px
    _d = config.inset, // outer frame px
    inset = _d === void 0 ? 3 : _d, // circle inset px
    _e = config.parent, // circle inset px
    parent = _e === void 0 ? document.body : _e;
    var svgns = "http://www.w3.org/2000/svg";
    var styles = document.createTextNode("\n    .lagRadar {\n      position: fixed;\n      bottom: 0.5rem;\n      right: 0.5rem;\n    }\n    .lagRadar {\n      pointer-events: none;\n    }\n    .lagRadar-sweep > * {\n      shape-rendering: crispEdges;\n    }\n    .lagRadar-face {\n      fill: transparent;\n    }\n    .lagRadar-hand {\n      stroke-width: 4px;\n      stroke-linecap: round;\n    }\n  ");
    function $svg(tag, props, children) {
        if (props === void 0) { props = {}; }
        if (children === void 0) { children = []; }
        var el = document.createElementNS(svgns, tag);
        Object.keys(props).forEach(function (prop) { return el.setAttribute(prop, props[prop]); });
        children.forEach(function (child) { return el.appendChild(child); });
        return el;
    }
    var PI2 = Math.PI * 2;
    var middle = size / 2;
    var radius = middle - inset;
    var $hand = $svg("path", { class: "lagRadar-hand" });
    var $arcs = new Array(frames).fill("path").map(function (t) { return $svg(t); });
    var $root = $svg("svg", {
        class: "lagRadar",
        height: size,
        width: size,
    }, [
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        $svg("style", { type: "text/css" }, [styles]),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        $svg("g", { class: "lagRadar-sweep" }, $arcs),
        $hand,
        $svg("circle", {
            class: "lagRadar-face",
            cx: middle,
            cy: middle,
            r: radius,
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ]);
    parent.appendChild($root);
    var frame;
    var framePtr = 0;
    var last = {
        rotation: 0,
        now: Date.now(),
        tx: middle + radius,
        ty: middle,
    };
    var calcHue = (function () {
        var max_hue = 120;
        var max_ms = 1000;
        var log_f = 10;
        var mult = max_hue / Math.log(max_ms / log_f);
        return function (ms_delta) {
            return (max_hue -
                Math.max(0, Math.min(mult * Math.log(ms_delta / log_f), max_hue)));
        };
    })();
    function animate() {
        var now = Date.now();
        var rdelta = Math.min(PI2 - speed, speed * (now - last.now));
        var rotation = (last.rotation + rdelta) % PI2;
        var tx = middle + radius * Math.cos(rotation);
        var ty = middle + radius * Math.sin(rotation);
        var bigArc = rdelta < Math.PI ? "0" : "1";
        var path = "M".concat(tx, " ").concat(ty, "A").concat(radius, " ").concat(radius, " 0 ").concat(bigArc, " 0 ").concat(last.tx, " ").concat(last.ty, "L").concat(middle, " ").concat(middle);
        var hue = calcHue(rdelta / speed);
        $arcs[framePtr % frames].setAttribute("d", path);
        $arcs[framePtr % frames].setAttribute("fill", "hsl(".concat(hue, ", 80%, 40%)"));
        $hand.setAttribute("d", "M".concat(middle, " ").concat(middle, "L").concat(tx, " ").concat(ty));
        $hand.setAttribute("stroke", "hsl(".concat(hue, ", 80%, 60%)"));
        for (var i = 0; i < frames; i++) {
            $arcs[(frames + framePtr - i) % frames].style.fillOpacity = (1 -
                i / frames);
        }
        framePtr++;
        last = {
            now: now,
            rotation: rotation,
            tx: tx,
            ty: ty,
        };
        frame = window.requestAnimationFrame(animate);
    }
    animate();
    return function destroy() {
        if (frame) {
            window.cancelAnimationFrame(frame);
        }
        $root.remove();
    };
}
