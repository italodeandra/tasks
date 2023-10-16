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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_2 = require("@headlessui/react");
var Stack_1 = __importDefault(require("../Stack"));
var Group_1 = __importDefault(require("../Group"));
var clsx_1 = __importDefault(require("clsx"));
var Button_1 = __importDefault(require("../Button"));
var solid_1 = require("@heroicons/react/24/solid");
function Modal(_a) {
    var open = _a.open, onClose = _a.onClose, children = _a.children, overlayClassName = _a.overlayClassName, panelClassName = _a.panelClassName, dialogClassName = _a.dialogClassName, dialogOuterPanelClassName = _a.dialogOuterPanelClassName, dialogOverflowClassName = _a.dialogOverflowClassName, style = _a.style;
    var handleOnClose = (0, react_1.useCallback)(function () { return onClose === null || onClose === void 0 ? void 0 : onClose(); }, [onClose]);
    return ((0, jsx_runtime_1.jsx)(react_2.Transition.Root, __assign({ show: open, as: react_1.Fragment }, { children: (0, jsx_runtime_1.jsxs)(react_2.Dialog, __assign({ as: "div", className: (0, clsx_1.default)("relative z-10", dialogClassName), onClose: handleOnClose, style: style }, { children: [(0, jsx_runtime_1.jsx)(react_2.Transition.Child, __assign({ as: react_1.Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0", enterTo: "opacity-100", leave: "ease-in duration-200", leaveFrom: "opacity-100", leaveTo: "opacity-0" }, { children: (0, jsx_runtime_1.jsx)("div", { className: (0, clsx_1.default)("fixed inset-0 bg-white/75 transition-opacity dark:bg-black/75", overlayClassName) }) })), (0, jsx_runtime_1.jsx)("div", __assign({ className: (0, clsx_1.default)("fixed inset-0 z-10 overflow-y-auto", dialogOverflowClassName) }, { children: (0, jsx_runtime_1.jsx)("div", __assign({ className: (0, clsx_1.default)("flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0", dialogOuterPanelClassName) }, { children: (0, jsx_runtime_1.jsx)(react_2.Transition.Child, __assign({ as: react_1.Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95", enterTo: "opacity-100 translate-y-0 sm:scale-100", leave: "ease-in duration-200", leaveFrom: "opacity-100 translate-y-0 sm:scale-100", leaveTo: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" }, { children: (0, jsx_runtime_1.jsx)(react_2.Dialog.Panel, __assign({ className: (0, clsx_1.default)("relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all dark:bg-zinc-900 dark:ring-1 dark:ring-white/5 sm:my-8 sm:w-full sm:max-w-sm", panelClassName) }, { children: children })) })) })) }))] })) })));
}
exports.default = Modal;
Modal.Container = ModalContainer;
function ModalContainer(_a) {
    var children = _a.children, className = _a.className;
    return ((0, jsx_runtime_1.jsx)(Stack_1.default, __assign({ className: (0, clsx_1.default)("!gap-4 px-4 pt-5 pb-4 sm:p-6", className) }, { children: children })));
}
Modal.Title = ModalTitle;
function ModalTitle(_a) {
    var children = _a.children, className = _a.className;
    return ((0, jsx_runtime_1.jsx)(react_2.Dialog.Title, __assign({ as: "h3", className: (0, clsx_1.default)("text-center text-lg font-medium leading-6 text-zinc-900 dark:text-zinc-100", className) }, { children: children })));
}
Modal.Content = ModalContent;
function ModalContent(_a) {
    var children = _a.children, className = _a.className;
    return ((0, jsx_runtime_1.jsx)("div", __assign({ className: (0, clsx_1.default)("text-center text-sm text-gray-500 dark:text-gray-400", className) }, { children: children })));
}
Modal.Actions = ModalActions;
function ModalActions(_a) {
    var children = _a.children, className = _a.className;
    return (0, jsx_runtime_1.jsx)(Group_1.default, __assign({ className: className }, { children: children }));
}
Modal.Icon = ModalIcon;
function ModalIcon(_a) {
    var children = _a.children;
    return ((0, jsx_runtime_1.jsx)("div", __assign({ className: "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-800" }, { children: children &&
            (0, react_1.cloneElement)(children, {
                className: "h-6 w-6 text-green-600 dark:text-green-400",
                "aria-hidden": "true",
            }) })));
}
Modal.CloseButton = ModalCloseButton;
function ModalCloseButton(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return ((0, jsx_runtime_1.jsx)(Button_1.default, __assign({ icon: true, className: (0, clsx_1.default)("absolute right-2 top-2", className), variant: "text" }, props, { children: (0, jsx_runtime_1.jsx)(solid_1.XMarkIcon, {}) })));
}
