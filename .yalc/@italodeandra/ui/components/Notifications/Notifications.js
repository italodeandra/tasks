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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var framer_motion_1 = require("framer-motion");
var valtio_1 = require("valtio");
var notifications_state_1 = __importDefault(require("./notifications.state"));
var outline_1 = require("@heroicons/react/24/outline");
var solid_1 = require("@heroicons/react/20/solid");
var Button_1 = __importDefault(require("../Button"));
var react_1 = require("react");
var clsx_1 = __importDefault(require("clsx"));
function Notifications(_a) {
    var notificationClassName = _a.notificationClassName;
    var _b = (0, valtio_1.useSnapshot)(notifications_state_1.default), notifications = _b.notifications, remove = _b.remove, setRendered = _b.setRendered;
    (0, react_1.useEffect)(function () {
        setRendered(true);
        return function () {
            setRendered(false);
        };
    }, [setRendered]);
    return ((0, jsx_runtime_1.jsx)("ul", __assign({ className: "pointer-events-none fixed inset-0 z-30 flex flex-col items-center justify-end gap-3 px-4 py-6 sm:items-end sm:justify-start sm:p-6" }, { children: (0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, __assign({ initial: false }, { children: notifications.map(function (_a) {
                var _b;
                var _id = _a._id, dismissable = _a.dismissable, title = _a.title, message = _a.message, icon = _a.icon, actions = _a.actions, style = _a.style, className = _a.className;
                // noinspection SuspiciousTypeOfGuard
                if (typeof icon === "string") {
                    icon = {
                        success: (0, jsx_runtime_1.jsx)(outline_1.CheckCircleIcon, { className: "!text-success-400" }),
                        error: (0, jsx_runtime_1.jsx)(outline_1.ExclamationCircleIcon, { className: "!text-error-400" }),
                    }[icon];
                }
                // noinspection SuspiciousTypeOfGuard
                return ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.li, __assign({ layout: true, initial: { opacity: 0, y: 50, scale: 0.3 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } }, className: (0, clsx_1.default)("pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5 dark:bg-zinc-800 dark:ring-white/10", notificationClassName, className), style: style }, { children: (0, jsx_runtime_1.jsx)("div", __assign({ className: "p-4" }, { children: (0, jsx_runtime_1.jsxs)("div", __assign({ className: "flex items-start" }, { children: [icon && ((0, jsx_runtime_1.jsx)("div", __assign({ className: "mr-2 flex-shrink-0 " }, { children: typeof icon === "string"
                                        ? icon
                                        : (0, react_1.cloneElement)(icon, {
                                            className: (0, clsx_1.default)("h-6 w-6 text-zinc-400 dark:text-zinc-600", (_b = icon.props) === null || _b === void 0 ? void 0 : _b.className),
                                            "aria-hidden": "true",
                                        }) }))), (0, jsx_runtime_1.jsxs)("div", __assign({ className: "ml-1 w-0 flex-1 pt-0.5" }, { children: [(0, jsx_runtime_1.jsx)("p", __assign({ className: "text-sm font-medium text-zinc-900 dark:text-zinc-100" }, { children: title || message })), title && message && ((0, jsx_runtime_1.jsx)("p", __assign({ className: "mt-1 text-sm text-zinc-500 dark:text-zinc-400" }, { children: message }))), actions && ((0, jsx_runtime_1.jsx)("div", __assign({ className: "-m-3 mt-0 flex" }, { children: actions })))] })), dismissable && ((0, jsx_runtime_1.jsx)("div", __assign({ className: "ml-4 flex flex-shrink-0" }, { children: (0, jsx_runtime_1.jsx)(Button_1.default, __assign({ icon: true, onClick: function () {
                                            remove(_id);
                                        }, className: "h-5 w-5 !p-0", variant: "text" }, { children: (0, jsx_runtime_1.jsx)(solid_1.XMarkIcon, { className: "h-5 w-5 text-gray-400", "aria-label": "Close" }) })) })))] })) })) }), _id));
            }) })) })));
}
exports.default = Notifications;
