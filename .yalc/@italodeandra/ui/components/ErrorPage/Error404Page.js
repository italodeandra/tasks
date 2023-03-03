"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var ErrorPage_1 = __importDefault(require("./ErrorPage"));
function Error404Page() {
    return ((0, jsx_runtime_1.jsx)(ErrorPage_1.default, { error: 404, title: "Uh oh! I think you're lost.", description: "It looks like the page you're looking for doesn't exist." }));
}
exports.default = Error404Page;
