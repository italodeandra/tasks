"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var ErrorPage_1 = __importDefault(require("./ErrorPage"));
function Error500Page() {
    return ((0, jsx_runtime_1.jsx)(ErrorPage_1.default, { error: 500, title: "Something bad just happened...", description: "Our servers could not handle your request. Don't worry, our development team was already notified. Try refreshing the page." }));
}
exports.default = Error500Page;
