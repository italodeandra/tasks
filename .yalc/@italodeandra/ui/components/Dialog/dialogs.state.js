"use strict";
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
exports.closeDialog = exports.showDialog = void 0;
var valtio_1 = require("valtio");
var isomorphicObjectId_1 = __importDefault(require("@italodeandra/next/utils/isomorphicObjectId"));
var lodash_1 = require("lodash");
var dialogsState = (0, valtio_1.proxy)({
    rendered: false,
    setRendered: function (rendered) {
        dialogsState.rendered = rendered;
    },
    dialogs: [],
    add: function (_a) {
        var _b = _a._id, _id = _b === void 0 ? (0, isomorphicObjectId_1.default)().toString() : _b, _c = _a.open, open = _c === void 0 ? true : _c, dialog = __rest(_a, ["_id", "open"]);
        if (!dialogsState.rendered) {
            console.error("<Dialogs /> is not rendered. The dialog will be ignored.");
        }
        dialogsState.dialogs.push({
            _id: _id,
            open: open,
            props: (0, valtio_1.ref)(dialog),
        });
    },
    remove: function (_id) {
        dialogsState.dialogs.splice(dialogsState.dialogs.findIndex(function (n) { return n._id === _id; }), 1);
    },
    update: function (dialog) {
        var updateDialog = (0, lodash_1.find)(dialogsState.dialogs, { _id: dialog._id });
        if (updateDialog) {
            Object.assign(updateDialog, dialog);
        }
    },
});
function showDialog(dialog) {
    dialogsState.add(dialog);
}
exports.showDialog = showDialog;
function closeDialog(_id) {
    dialogsState.update({
        _id: _id,
        open: false,
    });
    setTimeout(function () { return dialogsState.remove(_id); }, 300);
}
exports.closeDialog = closeDialog;
exports.default = dialogsState;
