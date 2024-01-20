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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_2 = __importDefault(require("cleave.js/react"));
var Input_1 = __importDefault(require("./Input"));
function CleaveInput(_a, ref) {
    var onChange = _a.onChange, name = _a.name, _b = _a.value, defaultValue = _b === void 0 ? "" : _b, options = _a.options, props = __rest(_a, ["onChange", "name", "value", "options"]);
    var _c = __read((0, react_1.useState)(defaultValue === null || defaultValue === void 0 ? void 0 : defaultValue.toString().replace(".", ",")), 2), value = _c[0], setValue = _c[1];
    var valueRef = (0, react_1.useRef)(defaultValue === null || defaultValue === void 0 ? void 0 : defaultValue.toString().replace(".", ","));
    var innerRef = (0, react_1.useRef)({
        get value() {
            return valueRef.current;
        },
        set value(value) {
            setValue(value.toString().replace(".", ","));
        },
    });
    (0, react_1.useEffect)(function () {
        if (ref) {
            if (typeof ref === "function") {
                ref(innerRef.current);
            }
            else {
                try {
                    ref.current = innerRef.current;
                }
                catch (e) {
                    // do nothing
                }
            }
        }
    }, [ref]);
    var handleOnChange = function (event) {
        if (onChange) {
            valueRef.current = event.target.rawValue;
            onChange({
                target: {
                    name: name,
                    value: +event.target.rawValue,
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            });
        }
    };
    (0, react_1.useEffect)(function () {
        setValue(defaultValue === null || defaultValue === void 0 ? void 0 : defaultValue.toString().replace(".", ","));
    }, [defaultValue]);
    return ((0, jsx_runtime_1.jsx)(Input_1.default
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    , __assign({}, props, { as: react_2.default, name: name, onChange: handleOnChange, options: options, value: value })));
}
exports.default = (0, react_1.forwardRef)(CleaveInput);
