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
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_2 = require("@headlessui/react");
var outline_1 = require("@heroicons/react/24/outline");
var Button_1 = __importDefault(require("../Button/Button"));
var Group_1 = __importDefault(require("../Group/Group"));
var clsx_1 = __importDefault(require("../../utils/clsx"));
function Drawer(_a) {
    var _b;
    var defaultOpen = _a.open, onClose = _a.onClose, title = _a.title, children = _a.children, _c = _a.position, position = _c === void 0 ? "left" : _c, actions = _a.actions, hideOverlay = _a.hideOverlay, className = _a.className, noPadding = _a.noPadding, panelClassName = _a.panelClassName;
    var _d = __read((0, react_1.useState)(defaultOpen), 2), open = _d[0], setOpen = _d[1];
    (0, react_1.useEffect)(function () {
        if (onClose && !open) {
            onClose(false);
        }
    }, [onClose, open]);
    (0, react_1.useEffect)(function () {
        setOpen(defaultOpen);
    }, [defaultOpen]);
    return ((0, jsx_runtime_1.jsx)(react_2.Transition.Root, { show: open, as: react_1.Fragment, children: (0, jsx_runtime_1.jsxs)(react_2.Dialog, { as: "div", className: (0, clsx_1.default)("relative z-20", className), onClose: setOpen, children: [!hideOverlay ? ((0, jsx_runtime_1.jsx)(react_2.Transition.Child, { as: react_1.Fragment, enter: "ease-in-out duration-300", enterFrom: "opacity-0", enterTo: "opacity-100", leave: "ease-in-out duration-300", leaveFrom: "opacity-100", leaveTo: "opacity-0", children: (0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/70 bg-opacity-75 transition-opacity" }) })) : ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0" })), (0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: (0, clsx_1.default)("pointer-events-none fixed inset-y-0 flex max-w-full", (_b = {},
                                _b["left-0 pr-10"] = !noPadding && position === "left",
                                _b["right-0 pl-10"] = !noPadding && position === "right",
                                _b)), children: (0, jsx_runtime_1.jsx)(react_2.Transition.Child, { as: react_1.Fragment, enter: "transform transition ease-in-out duration-300 sm:duration-500", enterFrom: position === "right"
                                    ? "translate-x-full"
                                    : "-translate-x-full", enterTo: position === "right" ? "translate-x-0" : "translate-x-0", leave: "transform transition ease-in-out duration-300 sm:duration-500", leaveFrom: position === "right" ? "translate-x-0" : "translate-x-0", leaveTo: position === "right"
                                    ? "translate-x-full"
                                    : "-translate-x-full", children: (0, jsx_runtime_1.jsx)(react_2.Dialog.Panel, { className: "pointer-events-auto w-screen max-w-md", children: (0, jsx_runtime_1.jsxs)("div", { className: (0, clsx_1.default)("flex h-full flex-col divide-y divide-zinc-200 bg-white shadow-xl dark:bg-zinc-900", panelClassName), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex min-h-0 flex-1 flex-col overflow-y-auto pb-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "sticky top-0 z-10 bg-white/95 px-4 py-6 backdrop-blur sm:px-6 [@supports(backdrop-filter:blur(0))]:bg-white/50 dark:[@supports(backdrop-filter:blur(0))]:bg-zinc-900/75", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start", children: [title && ((0, jsx_runtime_1.jsx)(react_2.Dialog.Title, { className: "text-lg font-medium text-zinc-900", children: title })), (0, jsx_runtime_1.jsx)("div", { className: "flex-grow" }), (0, jsx_runtime_1.jsx)("div", { className: "ml-3 flex h-7 items-center", children: (0, jsx_runtime_1.jsx)(Button_1.default, { icon: true, variant: "text", onClick: (0, react_1.useCallback)(function () { return setOpen(false); }, []), children: (0, jsx_runtime_1.jsx)(outline_1.XMarkIcon, { className: "h-6 w-6", "aria-hidden": "true" }) }) })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "relative flex-1 px-4 pt-1 sm:px-6", children: children })] }), actions && ((0, jsx_runtime_1.jsx)(Group_1.default, { className: "flex-shrink-0 justify-end px-4 py-4", children: actions }))] }) }) }) }) }) })] }) }));
}
exports.default = Drawer;
