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
var Input_1 = require("../Input");
var Button_1 = __importDefault(require("../Button"));
var FileSelect_1 = __importDefault(require("../FileSelect"));
var isomorphicObjectId_1 = __importDefault(require("@italodeandra/next/utils/isomorphicObjectId"));
var solid_1 = require("@heroicons/react/20/solid");
var lodash_1 = require("lodash");
var Text_1 = __importDefault(require("../Text/Text"));
var Stack_1 = __importDefault(require("../Stack"));
var outline_1 = require("@heroicons/react/24/outline");
var Group_1 = __importDefault(require("../Group"));
function PreviewFile(_a) {
    var file = _a.file, readOnly = _a.readOnly, handleDeleteClick = _a.handleDeleteClick, downloadText = _a.downloadText;
    var url = file.file
        ? URL.createObjectURL(file.file)
        : file.url;
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "group relative flex items-center justify-center rounded-md bg-zinc-200 dark:bg-zinc-800" }, { children: [file.type.startsWith("video") ? ((0, jsx_runtime_1.jsx)("video", { className: "max-h-96 rounded-md", src: url, controls: true })) : file.type.startsWith("image") ? (
            // eslint-disable-next-line @next/next/no-img-element
            (0, jsx_runtime_1.jsx)("img", { src: url, alt: file.description, className: "max-h-96 rounded-md" })) : ((0, jsx_runtime_1.jsxs)(Group_1.default, __assign({ className: "items-center gap-4 p-3" }, { children: [(0, jsx_runtime_1.jsx)("div", __assign({ className: "rounded-lg bg-zinc-300 p-2 dark:bg-zinc-800" }, { children: (0, jsx_runtime_1.jsx)(outline_1.DocumentIcon, { className: "h-5 w-5" }) })), (0, jsx_runtime_1.jsxs)(Stack_1.default, __assign({ className: "gap-1" }, { children: [(0, jsx_runtime_1.jsx)("div", { children: file.name }), file.description && (0, jsx_runtime_1.jsx)("div", { children: file.description }), (0, jsx_runtime_1.jsx)(Text_1.default, __assign({ size: "sm" }, { children: file.type })), !url.startsWith("blob") && ((0, jsx_runtime_1.jsx)(Button_1.default, __assign({ leading: (0, jsx_runtime_1.jsx)(outline_1.ArrowDownTrayIcon, {}), className: "mr-auto", href: url, download: file.name, target: "_blank" }, { children: downloadText })))] }))] }))), !readOnly && ((0, jsx_runtime_1.jsx)(Button_1.default, __assign({ icon: true, variant: "filled", color: "default", className: "absolute right-2 top-2 group-hover:opacity-100 sm:opacity-0", onClick: handleDeleteClick }, { children: (0, jsx_runtime_1.jsx)(solid_1.TrashIcon, {}) })))] })));
}
function FileInput(_a, ref) {
    var _b;
    var error = _a.error, className = _a.className, helpText = _a.helpText, onChange = _a.onChange, name = _a.name, limit = _a.limit, label = _a.label, id = _a.id, required = _a.required, onMouseOver = _a.onMouseOver, onMouseOut = _a.onMouseOut, readOnly = _a.readOnly, defaultValue = _a.defaultValue, _c = _a.emptyText, emptyText = _c === void 0 ? "No files" : _c, _d = _a.downloadText, downloadText = _d === void 0 ? "Download" : _d, props = __rest(_a, ["error", "className", "helpText", "onChange", "name", "limit", "label", "id", "required", "onMouseOver", "onMouseOut", "readOnly", "defaultValue", "emptyText", "downloadText"]);
    var _e = __read((0, react_1.useState)(defaultValue || []), 2), value = _e[0], setValue = _e[1];
    (0, react_use_1.useDeepCompareEffect)(function () {
        if (defaultValue && !(0, lodash_1.isEqual)(defaultValue, value)) {
            setValue(defaultValue);
        }
    }, [{ defaultValue: defaultValue }]);
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
            .filter(function (_file, index) { return !limit || index <= limit - value.length - 1; })
            .map(function (file) { return ({
            _id: (0, isomorphicObjectId_1.default)(),
            name: file.name,
            file: file,
            type: file.type,
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
                        name: image.name,
                        type: image.type,
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
                }) }, { children: [value.map(function (image, i) { return ((0, jsx_runtime_1.jsx)(PreviewFile, { file: image, readOnly: readOnly, handleDeleteClick: handleDeleteClick(image), downloadText: downloadText }, i)); }), readOnly && !value.length && ((0, jsx_runtime_1.jsx)(Text_1.default, __assign({ variant: "secondary" }, { children: emptyText }))), !readOnly && (!limit || value.length < limit) && ((0, jsx_runtime_1.jsx)(FileSelect_1.default, __assign({}, props, { id: id, onAcceptFiles: handleAcceptFiles, limit: limit ? limit - value.length : undefined })))] })), helpText && (0, jsx_runtime_1.jsx)("div", __assign({ className: Input_1.defaultHelpTextClassName }, { children: helpText }))] })));
}
exports.default = (0, react_1.forwardRef)(FileInput);
