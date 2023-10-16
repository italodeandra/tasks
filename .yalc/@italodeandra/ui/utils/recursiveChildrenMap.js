"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
function recursiveChildrenMap(children, fn) {
    return react_1.Children.map(children, function (child) {
        if (!(0, react_1.isValidElement)(child)) {
            return child;
        }
        if (child.props.children) {
            child = (0, react_1.cloneElement)(child, {
                children: recursiveChildrenMap(child.props.children, fn),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            });
        }
        return fn(child);
    });
}
exports.default = recursiveChildrenMap;
