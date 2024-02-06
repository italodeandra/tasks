"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
function useWhyDidYouUpdate(name, props) {
    // create a reference to track the previous data
    var previousProps = (0, react_1.useRef)({});
    (0, react_1.useEffect)(function () {
        if (previousProps.current) {
            // merge the keys of previous and current data
            var keys = Object.keys(__assign(__assign({}, previousProps.current), props));
            // to store what has changed
            var changesObj_1 = {};
            // check what values have changed between the previous and current
            keys.forEach(function (key) {
                // if both are object
                if (typeof props[key] === "object" &&
                    typeof previousProps.current[key] === "object") {
                    if (JSON.stringify(previousProps.current[key]) !==
                        JSON.stringify(props[key])) {
                        // add to changesObj
                        changesObj_1[key] = {
                            from: previousProps.current[key],
                            to: props[key],
                        };
                    }
                }
                else {
                    // if both are non-object
                    if (previousProps.current[key] !== props[key]) {
                        // add to changesObj
                        changesObj_1[key] = {
                            from: previousProps.current[key],
                            to: props[key],
                        };
                    }
                }
            });
            // if changesObj not empty, print the cause
            if (Object.keys(changesObj_1).length) {
                console.info("This is causing re-renders", name, changesObj_1);
            }
        }
        // update the previous props with the current
        previousProps.current = props;
    });
}
exports.default = useWhyDidYouUpdate;
