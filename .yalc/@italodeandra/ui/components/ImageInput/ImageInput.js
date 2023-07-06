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
var clsx_1 = __importDefault(require("clsx"));
var react_1 = require("react");
var react_use_1 = require("react-use");
var Input_1 = require("../Input/Input");
var Button_1 = __importDefault(require("../Button/Button"));
var FileSelect_1 = __importDefault(require("../FileSelect/FileSelect"));
var isomorphicObjectId_1 = __importDefault(require("@italodeandra/next/utils/isomorphicObjectId"));
var solid_1 = require("@heroicons/react/20/solid");
var lodash_1 = require("lodash");
var Text_1 = __importDefault(require("../Text/Text"));
function ImageInput(_a, ref) {
    var _b;
    var error = _a.error, className = _a.className, helpText = _a.helpText, onChange = _a.onChange, name = _a.name, limit = _a.limit, label = _a.label, id = _a.id, required = _a.required, onMouseOver = _a.onMouseOver, onMouseOut = _a.onMouseOut, readOnly = _a.readOnly, defaultValue = _a.defaultValue, _c = _a.emptyText, emptyText = _c === void 0 ? "No images" : _c, props = __rest(_a, ["error", "className", "helpText", "onChange", "name", "limit", "label", "id", "required", "onMouseOver", "onMouseOut", "readOnly", "defaultValue", "emptyText"]);
    var _d = __read((0, react_1.useState)(defaultValue || []), 2), value = _d[0], setValue = _d[1];
    (0, react_use_1.useDeepCompareEffect)(function () {
        if (defaultValue && !(0, lodash_1.isEqual)(defaultValue, value)) {
            setValue(defaultValue);
        }
    }, [defaultValue]);
    var innerRef = (0, react_1.useRef)({
        get value() {
            return value;
        },
        set value(value) {
            setValue(value || []);
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
    var handleAcceptFiles = function (files) {
        setValue(function (value) { return __spreadArray(__spreadArray([], __read(value), false), __read(files
            .filter(function (file, index) { return !limit || index <= limit - value.length - 1; })
            .map(function (file) { return ({
            _id: (0, isomorphicObjectId_1.default)(),
            name: file.name,
            file: file,
        }); })), false); });
    };
    (0, react_use_1.useUpdateEffect)(function () {
        if (onChange) {
            onChange({
                target: {
                    name: name,
                    value: value.map(function (image) { return ({
                        url: image.file
                            ? URL.createObjectURL(image.file)
                            : image.url,
                        description: image.description,
                    }); }),
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);
    var handleDeleteClick = (0, react_1.useCallback)(function (clickedFile) { return function () {
        setValue(function (value) { return __spreadArray([], __read(value.filter(function (file) { return file !== clickedFile; })), false); });
    }; }, []);
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: (0, clsx_1.default)("relative", className, (_b = {},
            _b["error"] = error,
            _b)), onMouseOver: onMouseOver, onMouseOut: onMouseOut }, { children: [label && ((0, jsx_runtime_1.jsxs)("label", __assign({ htmlFor: id, className: Input_1.defaultLabelClassName }, { children: [label, required && " *"] }))), (0, jsx_runtime_1.jsxs)("div", __assign({ className: (0, clsx_1.default)("grid grid-cols-1 gap-4", {
                    "md:grid-cols-2": !!value.length,
                }) }, { children: [value.map(function (image, i) { return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "relative flex items-center justify-center rounded-md bg-gray-200 dark:bg-zinc-800" }, { children: [(0, jsx_runtime_1.jsx)("img", { src: image.file
                                    ? URL.createObjectURL(image.file)
                                    : image.url, alt: image.description, className: "max-h-96 rounded-md" }), !readOnly && ((0, jsx_runtime_1.jsx)(Button_1.default, __assign({ icon: true, variant: "light", color: "white", className: "absolute right-2 top-2", onClick: handleDeleteClick(image) }, { children: (0, jsx_runtime_1.jsx)(solid_1.TrashIcon, {}) })))] }), i)); }), readOnly && !value.length && ((0, jsx_runtime_1.jsx)(Text_1.default, __assign({ variant: "secondary" }, { children: emptyText }))), !readOnly && (!limit || value.length < limit) && ((0, jsx_runtime_1.jsx)(FileSelect_1.default, __assign({}, props, { id: id, onAcceptFiles: handleAcceptFiles, limit: limit ? limit - value.length : undefined })))] })), helpText && (0, jsx_runtime_1.jsx)("div", __assign({ className: Input_1.defaultHelpTextClassName }, { children: helpText }))] })));
}
exports.default = (0, react_1.forwardRef)(ImageInput);
