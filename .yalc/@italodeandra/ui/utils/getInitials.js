"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Gets all the initials of a name.
 */
function getInitials(name, separator) {
    if (separator === void 0) { separator = " "; }
    var splitName = name.split(separator).slice(0, 2);
    var splitInitials = splitName.map(function (n) { return n.charAt(0); });
    return splitInitials.join("");
}
exports.default = getInitials;
