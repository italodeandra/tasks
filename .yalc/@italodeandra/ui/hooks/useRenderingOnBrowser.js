"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_use_1 = require("react-use");
function useRenderingOnBrowser() {
    var rendersCount = (0, react_use_1.useRendersCount)();
    return rendersCount > 1;
}
exports.default = useRenderingOnBrowser;
