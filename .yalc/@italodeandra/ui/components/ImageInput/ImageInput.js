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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var converters_1 = require("@italodeandra/next/fileStorage/converters");
function PreviewFile(_a) {
    var _this = this;
    var image = _a.image, readOnly = _a.readOnly, handleDeleteClick = _a.handleDeleteClick;
    var url = image.file
        ? URL.createObjectURL(image.file)
        : image.url;
    var _b = (0, react_use_1.useAsync)(function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!image.file) return [3 /*break*/, 1];
                    _a = image.file.type === "video/mp4";
                    return [3 /*break*/, 5];
                case 1:
                    if (!url.startsWith("blob")) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, converters_1.blobUrlToObject)(url)];
                case 2:
                    _b = (_c.sent()).type === "video/mp4";
                    return [3 /*break*/, 4];
                case 3:
                    _b = url.endsWith("mp4");
                    _c.label = 4;
                case 4:
                    _a = _b;
                    _c.label = 5;
                case 5: return [2 /*return*/, _a];
            }
        });
    }); }), isVideo = _b.value, loading = _b.loading;
    if (loading) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "group relative flex items-center justify-center rounded-md bg-gray-200 dark:bg-zinc-800" }, { children: [isVideo ? ((0, jsx_runtime_1.jsx)("video", { className: "max-h-96 rounded-md", src: url, controls: true })) : (
            // eslint-disable-next-line @next/next/no-img-element
            (0, jsx_runtime_1.jsx)("img", { src: url, alt: image.description, className: "max-h-96 rounded-md" })), !readOnly && ((0, jsx_runtime_1.jsx)(Button_1.default, __assign({ icon: true, variant: "filled", color: "default", className: "absolute right-2 top-2 group-hover:opacity-100 sm:opacity-0", onClick: handleDeleteClick }, { children: (0, jsx_runtime_1.jsx)(solid_1.TrashIcon, {}) })))] })));
}
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
            .filter(function (_file, index) { return !limit || index <= limit - value.length - 1; })
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
                }) }, { children: [value.map(function (image, i) { return ((0, jsx_runtime_1.jsx)(PreviewFile, { image: image, readOnly: readOnly, handleDeleteClick: handleDeleteClick(image) }, i)); }), readOnly && !value.length && ((0, jsx_runtime_1.jsx)(Text_1.default, __assign({ variant: "secondary" }, { children: emptyText }))), !readOnly && (!limit || value.length < limit) && ((0, jsx_runtime_1.jsx)(FileSelect_1.default, __assign({}, props, { id: id, onAcceptFiles: handleAcceptFiles, limit: limit ? limit - value.length : undefined })))] })), helpText && (0, jsx_runtime_1.jsx)("div", __assign({ className: Input_1.defaultHelpTextClassName }, { children: helpText }))] })));
}
exports.default = (0, react_1.forwardRef)(ImageInput);
