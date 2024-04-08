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
var FileInput_1 = __importDefault(require("../FileInput"));
var defaultIcon = ((0, jsx_runtime_1.jsx)("svg", { stroke: "currentColor", fill: "none", viewBox: "0 0 48 48", "aria-hidden": "true", children: (0, jsx_runtime_1.jsx)("path", { d: "M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }) }));
function ImageInput(_a, ref) {
    var _b = _a.icon, icon = _b === void 0 ? defaultIcon : _b, _c = _a.uploadAFileText, uploadAFileText = _c === void 0 ? "Upload an image" : _c, _d = _a.allowedFileTypes, allowedFileTypes = _d === void 0 ? [".png", ".jpg", ".jpeg", ".webp"] : _d, _e = _a.preview, preview = _e === void 0 ? true : _e, props = __rest(_a, ["icon", "uploadAFileText", "allowedFileTypes", "preview"]);
    return ((0, jsx_runtime_1.jsx)(FileInput_1.default, __assign({ ref: ref }, props, { icon: icon, uploadAFileText: uploadAFileText, allowedFileTypes: allowedFileTypes, preview: preview })));
}
exports.default = (0, react_1.forwardRef)(ImageInput);
