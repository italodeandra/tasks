"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
function useBeforeUnload(message) {
    (0, react_1.useEffect)(function () {
        if (message) {
            var handleBeforeUnload_1 = function (e) {
                e.preventDefault();
                e.returnValue = message; // This message is not shown in most browsers
                return message; // Some older browsers may display this message
            };
            window.addEventListener("beforeunload", handleBeforeUnload_1);
            return function () {
                window.removeEventListener("beforeunload", handleBeforeUnload_1);
            };
        }
    }, [message]);
}
exports.default = useBeforeUnload;
