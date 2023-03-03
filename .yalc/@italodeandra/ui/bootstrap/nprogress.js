"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var colors_1 = __importDefault(require("tailwindcss/colors"));
var bar_of_progress_1 = __importDefault(require("@badrap/bar-of-progress"));
var router_1 = __importDefault(require("next/router"));
function setupNProgress(color) {
    if (color === void 0) { color = colors_1.default.sky[500]; }
    var progress = new bar_of_progress_1.default({
        size: 2,
        color: color,
        className: "bar-of-progress",
        delay: 100,
    });
    // this fixes safari jumping to the bottom of the page
    // when closing the search modal using the `esc` key
    if (typeof window !== "undefined") {
        progress.start();
        progress.finish();
    }
    router_1.default.events.on("routeChangeStart", function () { return progress.start(); });
    router_1.default.events.on("routeChangeComplete", function () { return progress.finish(); });
    router_1.default.events.on("routeChangeError", function () { return progress.finish(); });
}
exports.default = setupNProgress;
