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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var valtio_1 = require("valtio");
var dialogs_state_1 = __importDefault(require("./dialogs.state"));
var react_1 = require("react");
var Modal_1 = __importStar(require("../Modal"));
var clsx_1 = __importDefault(require("../../utils/clsx"));
function Dialog(_a) {
    var icon = _a.icon, open = _a.open, title = _a.title, content = _a.content, actions = _a.actions, _id = _a._id, hideCloseButton = _a.hideCloseButton, containerClassName = _a.containerClassName, panelClassName = _a.panelClassName, style = _a.style, overlayClassName = _a.overlayClassName, dialogClassName = _a.dialogClassName, dialogOuterPanelClassName = _a.dialogOuterPanelClassName;
    var _b = __read((0, Modal_1.useModalState)(), 2), modalOpen = _b[0], _c = _b[1], openModal = _c.openModal, closeModal = _c.closeModal;
    (0, react_1.useEffect)(function () {
        if (open) {
            openModal();
        }
        else {
            closeModal();
        }
    }, [closeModal, open, openModal]);
    return ((0, jsx_runtime_1.jsx)(Modal_1.default, { open: modalOpen, onClose: closeModal, panelClassName: panelClassName, style: style, overlayClassName: overlayClassName, dialogClassName: dialogClassName, dialogOuterPanelClassName: dialogOuterPanelClassName, children: (0, jsx_runtime_1.jsxs)(Modal_1.default.Container, { className: containerClassName, children: [!hideCloseButton && (0, jsx_runtime_1.jsx)(Modal_1.default.CloseButton, { onClick: closeModal }), icon && (0, jsx_runtime_1.jsx)(Modal_1.default.Icon, { children: icon }), title && (0, jsx_runtime_1.jsx)(Modal_1.default.Title, { children: title }), content && ((0, jsx_runtime_1.jsx)(Modal_1.default.Content, { children: typeof content === "function"
                        ? content(_id)
                        : content })), actions && ((0, jsx_runtime_1.jsx)(Modal_1.default.Actions, { children: typeof actions === "function"
                        ? actions(_id)
                        : actions }))] }) }));
}
function Dialogs(_a) {
    var containerClassName = _a.containerClassName, panelClassName = _a.panelClassName, overlayClassName = _a.overlayClassName, dialogClassName = _a.dialogClassName, dialogOuterPanelClassName = _a.dialogOuterPanelClassName;
    var _b = (0, valtio_1.useSnapshot)(dialogs_state_1.default), dialogs = _b.dialogs, setRendered = _b.setRendered;
    (0, react_1.useEffect)(function () {
        setRendered(true);
        return function () {
            setRendered(false);
        };
    }, [setRendered]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: dialogs.map(function (dialog) { return ((0, jsx_runtime_1.jsx)(Dialog, __assign({}, dialog, { containerClassName: containerClassName, panelClassName: (0, clsx_1.default)(panelClassName, dialog.panelClassName), overlayClassName: overlayClassName, dialogClassName: (0, clsx_1.default)(dialogClassName, dialog.dialogClassName), dialogOuterPanelClassName: dialogOuterPanelClassName }), dialog._id)); }) }));
}
exports.default = Dialogs;
