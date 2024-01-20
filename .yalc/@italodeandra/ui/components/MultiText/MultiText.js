"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lodash_1 = require("lodash");
var react_use_1 = require("react-use");
var solid_1 = require("@heroicons/react/20/solid");
var InputWrapper_1 = __importDefault(require("../Input2/InputWrapper"));
function MultiText(_a, ref) {
    var value = _a.value, onChangeValue = _a.onChangeValue, onChange = _a.onChange, onBlur = _a.onBlur, name = _a.name, id = _a.id, className = _a.className, helpText = _a.helpText, label = _a.label, validate = _a.validate, invalidHelpText = _a.invalidHelpText, error = _a.error;
    var innerId = (0, react_1.useId)();
    id = id || innerId;
    var inputRef = (0, react_1.useRef)(null);
    var _b = __read((0, react_1.useState)(false), 2), innerFocused = _b[0], setInnerFocused = _b[1];
    var _c = __read((0, react_1.useState)(value || []), 2), innerValue = _c[0], setInnerValue = _c[1];
    var _d = __read((0, react_1.useState)(""), 2), inputValue = _d[0], setInputValue = _d[1];
    var _e = __read((0, react_1.useState)(false), 2), invalid = _e[0], setInvalid = _e[1];
    (0, react_use_1.useDeepCompareEffect)(function () {
        if (value && onChangeValue && !(0, lodash_1.isEqual)(value, innerValue)) {
            onChangeValue(innerValue);
        }
    }, [innerValue]);
    (0, react_use_1.useDeepCompareEffect)(function () {
        if (value && !(0, lodash_1.isEqual)(value, innerValue)) {
            setInnerValue(value);
        }
    }, [value || []]);
    var innerRef = (0, react_1.useRef)({
        get value() {
            return innerValue;
        },
        set value(value) {
            setInnerValue(value);
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
    (0, react_use_1.useDeepCompareEffect)(function () {
        if (onChange) {
            onChange({
                target: {
                    name: name,
                    value: innerValue,
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [innerValue]);
    return ((0, jsx_runtime_1.jsx)(InputWrapper_1.default, { id: id, className: className, helpText: (invalid ? invalidHelpText : undefined) || helpText, label: label, error: invalid || error, children: (0, jsx_runtime_1.jsxs)("div", { className: "ui-multi-text", onClick: function () { var _a; return (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus(); }, "data-focused": innerFocused ? "" : undefined, "data-error": invalid || error ? "" : undefined, children: [innerValue.map(function (item, i) {
                    var removeItem = function () {
                        var _a;
                        var newValue = __spreadArray([], __read(innerValue), false);
                        newValue.splice(i, 1);
                        setInnerValue(newValue);
                        (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
                    };
                    return ((0, jsx_runtime_1.jsxs)("span", { className: "ui-multi-text-item", onClick: function (e) { return e.stopPropagation(); }, onDoubleClick: function () {
                            setInputValue(item);
                            removeItem();
                        }, children: [(0, jsx_runtime_1.jsx)("span", { className: "ui-multi-text-item-content", children: item }), (0, jsx_runtime_1.jsx)("button", { className: "ui-multi-text-delete-button", onClick: removeItem, children: (0, jsx_runtime_1.jsx)(solid_1.XMarkIcon, { className: "ui-multi-text-delete-icon" }) })] }, i));
                }), (0, jsx_runtime_1.jsx)("input", { id: id, ref: inputRef, type: "text", className: "ui-multi-text-input", value: inputValue, onChange: function (e) {
                        setInvalid(false);
                        setInputValue(e.target.value);
                    }, onBlur: function (e) {
                        setInvalid(false);
                        setInputValue("");
                        setInnerFocused(false);
                        onBlur === null || onBlur === void 0 ? void 0 : onBlur(e);
                    }, onKeyDown: function (e) {
                        var value = e.currentTarget.value;
                        if (e.code === "Enter") {
                            e.preventDefault();
                            if (!validate || validate(value)) {
                                setInnerValue(__spreadArray(__spreadArray([], __read(innerValue), false), [value], false));
                                setInputValue("");
                            }
                            else {
                                setInvalid(true);
                            }
                        }
                    }, onFocus: function () { return setInnerFocused(true); } })] }) }));
}
exports.default = (0, react_1.forwardRef)(MultiText);
