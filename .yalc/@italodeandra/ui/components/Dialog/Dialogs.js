"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var valtio_1 = require("valtio");
var dialogs_state_1 = __importStar(require("./dialogs.state"));
var react_1 = require("react");
var Dialog_1 = __importDefault(require("./Dialog"));
function Dialogs() {
    var _a = (0, valtio_1.useSnapshot)(dialogs_state_1.default), dialogs = _a.dialogs, setRendered = _a.setRendered;
    (0, react_1.useEffect)(function () {
        setRendered(true);
        return function () {
            setRendered(false);
        };
    }, [setRendered]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: dialogs.map(function (dialog) { return ((0, jsx_runtime_1.jsx)(Dialog_1.default, { title: dialog.props.title, description: dialog.props.description, open: dialog.open, onOpenChange: function () {
                var _a, _b;
                (0, dialogs_state_1.closeDialog)(dialog._id);
                (_b = (_a = dialog.props).onClose) === null || _b === void 0 ? void 0 : _b.call(_a, dialog._id);
            }, contentClassName: dialog.props.contentClassName, contentOverflowClassName: dialog.props.contentOverflowClassName, children: dialog.props.content }, dialog._id)); }) }));
}
exports.default = Dialogs;
