"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function capitalize(text) {
    return text === null || text === void 0 ? void 0 : text.split(" ").map(function (word) { return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); }).join(" ");
}
exports.default = capitalize;
