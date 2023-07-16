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
var Modal_1 = __importDefault(require("../Modal/Modal"));
var useModalState_1 = __importDefault(require("../Modal/useModalState"));
function Dialog(_a) {
    var icon = _a.icon, open = _a.open, title = _a.title, content = _a.content, actions = _a.actions, _id = _a._id;
    var _b = __read((0, useModalState_1.default)(), 2), modalOpen = _b[0], _c = _b[1], openModal = _c.openModal, closeModal = _c.closeModal;
    (0, react_1.useEffect)(function () {
        if (open) {
            openModal();
        }
        else {
            closeModal();
        }
    }, [closeModal, open, openModal]);
    return ((0, jsx_runtime_1.jsx)(Modal_1.default, __assign({ open: modalOpen, onClose: closeModal }, { children: (0, jsx_runtime_1.jsxs)(Modal_1.default.Container, { children: [(0, jsx_runtime_1.jsx)(Modal_1.default.CloseButton, { onClick: closeModal }), icon && (0, jsx_runtime_1.jsx)(Modal_1.default.Icon, { children: icon }), title && (0, jsx_runtime_1.jsx)(Modal_1.default.Title, { children: title }), content && ((0, jsx_runtime_1.jsx)(Modal_1.default.Content, { children: typeof content === "function"
                        ? content(_id)
                        : content })), actions && ((0, jsx_runtime_1.jsx)(Modal_1.default.Actions, { children: typeof actions === "function"
                        ? actions(_id)
                        : actions }))] }) })));
}
function Dialogs() {
    var _a = (0, valtio_1.useSnapshot)(dialogs_state_1.default), dialogs = _a.dialogs, setRendered = _a.setRendered;
    (0, react_1.useEffect)(function () {
        setRendered(true);
        return function () {
            setRendered(false);
        };
    }, [setRendered]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: dialogs.map(function (dialog) { return ((0, jsx_runtime_1.jsx)(Dialog, __assign({}, dialog), dialog._id)); }) }));
}
exports.default = Dialogs;
