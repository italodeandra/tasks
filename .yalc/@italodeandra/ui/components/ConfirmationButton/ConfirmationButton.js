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
var Menu_1 = __importDefault(require("../Menu/Menu"));
var Button_1 = __importDefault(require("../Button"));
function ConfirmationButton(_a) {
    var label = _a.label, confirm = _a.confirm, confirmation = _a.confirmation, onConfirm = _a.onConfirm, loading = _a.loading, className = _a.className, _b = _a.cancel, cancel = _b === void 0 ? "Cancel" : _b, position = _a.position, buttonClassName = _a.buttonClassName, buttonProps = _a.buttonProps, menuProps = _a.menuProps;
    return ((0, jsx_runtime_1.jsxs)(Menu_1.default, __assign({ position: position, button: (0, jsx_runtime_1.jsx)(Button_1.default, __assign({ color: "error", loading: loading, className: buttonClassName }, buttonProps, { children: label })), className: className }, menuProps, { children: [(0, jsx_runtime_1.jsx)(Menu_1.default.Label, { children: confirmation }), (0, jsx_runtime_1.jsx)(Menu_1.default.Item, __assign({ className: "!text-red-500", onClick: onConfirm }, { children: confirm || label })), (0, jsx_runtime_1.jsx)(Menu_1.default.Item, { children: cancel })] })));
}
exports.default = ConfirmationButton;
