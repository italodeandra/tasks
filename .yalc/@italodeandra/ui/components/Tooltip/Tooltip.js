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
exports.TooltipContent = exports.TooltipAnchor = exports.useTooltipState = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_merge_refs_1 = __importDefault(require("react-merge-refs"));
var react_dom_interactions_1 = require("@floating-ui/react-dom-interactions");
var framer_motion_1 = require("framer-motion");
var clsx_1 = __importDefault(require("clsx"));
function useTooltipState(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.initialOpen, initialOpen = _c === void 0 ? false : _c, _d = _b.placement, placement = _d === void 0 ? "bottom" : _d, id = _b.id, delayGroupContext = _b.delayGroupContext, delay = _b.delay;
    var _e = __read((0, react_1.useState)(initialOpen), 2), open = _e[0], setOpen = _e[1];
    // noinspection JSUnusedGlobalSymbols
    var data = (0, react_dom_interactions_1.useFloating)({
        placement: placement,
        open: open,
        onOpenChange: function (open) {
            setOpen(open);
            if (open && delayGroupContext) {
                delayGroupContext.setCurrentId(id);
            }
        },
        whileElementsMounted: react_dom_interactions_1.autoUpdate,
        middleware: [(0, react_dom_interactions_1.offset)(8), (0, react_dom_interactions_1.flip)(), (0, react_dom_interactions_1.shift)()],
    });
    var context = data.context;
    var hover = (0, react_dom_interactions_1.useHover)(context, {
        move: false,
        delay: delay || (delayGroupContext === null || delayGroupContext === void 0 ? void 0 : delayGroupContext.delay),
    });
    var focus = (0, react_dom_interactions_1.useFocus)(context);
    var dismiss = (0, react_dom_interactions_1.useDismiss)(context);
    var role = (0, react_dom_interactions_1.useRole)(context, { role: "tooltip" });
    var interactions = (0, react_dom_interactions_1.useInteractions)([hover, focus, dismiss, role]);
    return (0, react_1.useMemo)(function () { return (__assign(__assign({ open: open, setOpen: setOpen }, interactions), data)); }, [open, setOpen, interactions, data]);
}
exports.useTooltipState = useTooltipState;
exports.TooltipAnchor = (0, react_1.forwardRef)(function TooltipAnchor(_a, propRef) {
    var children = _a.children, state = _a.state, _b = _a.asChild, asChild = _b === void 0 ? false : _b, props = __rest(_a, ["children", "state", "asChild"]);
    var ref = (0, react_1.useMemo)(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function () { return (0, react_merge_refs_1.default)([state.reference, propRef, children.ref]); }, [state.reference, propRef, children]);
    // `asChild` allows the user to pass any element as the anchor
    if (asChild && typeof children !== "string") {
        return (0, react_1.cloneElement)(children, state.getReferenceProps(__assign(__assign({ ref: ref }, props), children.props)));
    }
    return ((0, jsx_runtime_1.jsx)("button", __assign({ ref: ref }, state.getReferenceProps(props), { children: children })));
});
exports.TooltipContent = (0, react_1.forwardRef)(function TooltipContent(_a, propRef) {
    var _b, _c;
    var state = _a.state, className = _a.className, props = __rest(_a, ["state", "className"]);
    var delay = (0, react_dom_interactions_1.useDelayGroupContext)().delay;
    var ref = (0, react_1.useMemo)(function () { return (0, react_merge_refs_1.default)([state.floating, propRef]); }, [state.floating, propRef]);
    return ((0, jsx_runtime_1.jsx)(react_dom_interactions_1.FloatingPortal, { children: (0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { children: state.open && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, __assign({ initial: { opacity: 0, scale: 0.85 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0 }, transition: 
                // When in "grouped phase", make the transition faster
                // The open delay becomes 1ms during this phase.
                typeof delay === "object" && delay.open === 1
                    ? { duration: 0.08 }
                    : { type: "spring", damping: 20, stiffness: 300 }, className: (0, clsx_1.default)("z-20 rounded bg-zinc-900/95 px-2 py-1 text-center text-sm text-white", className), ref: ref, style: __assign({ position: state.strategy, top: (_b = state.y) !== null && _b !== void 0 ? _b : 0, left: (_c = state.x) !== null && _c !== void 0 ? _c : 0 }, props.style) }, state.getFloatingProps(props)))) }) }));
});
function Tooltip(_a) {
    var children = _a.children, content = _a.content, placement = _a.placement, delay = _a.delay, className = _a.className;
    var delayGroupContext = (0, react_dom_interactions_1.useDelayGroupContext)();
    var state = useTooltipState({
        delayGroupContext: delayGroupContext,
        id: content,
        placement: placement,
        delay: delay,
    });
    (0, react_dom_interactions_1.useDelayGroup)(state.context, { id: content });
    if (!content) {
        return children;
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(exports.TooltipAnchor, __assign({ state: state, asChild: true }, { children: children })), (0, jsx_runtime_1.jsx)(exports.TooltipContent, __assign({ state: state, className: className }, { children: content }))] }));
}
exports.default = Tooltip;
Tooltip.Group = function TooltipGroup(_a) {
    var children = _a.children, _b = _a.delay, delay = _b === void 0 ? 200 : _b;
    return (0, jsx_runtime_1.jsx)(react_dom_interactions_1.FloatingDelayGroup, __assign({ delay: delay }, { children: children }));
};
