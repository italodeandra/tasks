"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var Code_1 = __importDefault(require("./Code"));
var lodash_1 = require("lodash");
function Json(_a) {
    var json = _a.json, className = _a.className;
    return ((0, jsx_runtime_1.jsx)(Code_1.default, { language: "json", className: className, children: JSON.stringify((0, lodash_1.isNil)(json) ? null : json, null, 2) }));
}
exports.default = Json;
