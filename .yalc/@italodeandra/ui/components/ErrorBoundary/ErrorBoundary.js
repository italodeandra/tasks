"use strict";
"use client";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var Alert_1 = __importDefault(require("../Alert/Alert"));
var Button_1 = __importDefault(require("../Button/Button"));
var ErrorBoundary = /** @class */ (function (_super) {
    __extends(ErrorBoundary, _super);
    function ErrorBoundary(props) {
        var _this = _super.call(this, props) || this;
        // Define a state variable to track whether is an error or not
        _this.state = { hasError: false };
        return _this;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ErrorBoundary.getDerivedStateFromError = function (_error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    };
    ErrorBoundary.prototype.componentDidCatch = function (error, errorInfo) {
        console.error({ error: error, errorInfo: errorInfo });
    };
    ErrorBoundary.prototype.render = function () {
        var _this = this;
        // Check if the error is thrown
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return ((0, jsx_runtime_1.jsx)(Alert_1.default, { variant: "error", title: this.props.title || "Oops, there was an unexpected error", actions: this.props.tryAgain && ((0, jsx_runtime_1.jsx)(Button_1.default, { variant: "text", color: "error", onClick: function () { return _this.setState({ hasError: false }); }, children: this.props.tryAgain })), children: this.props.content }));
        }
        // Return children components in case of no error
        return this.props.children;
    };
    return ErrorBoundary;
}(react_1.Component));
exports.default = ErrorBoundary;
