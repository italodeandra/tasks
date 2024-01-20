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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var clsx_1 = __importDefault(require("../../utils/clsx"));
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
var numeral_1 = __importDefault(require("numeral"));
var videoExtensions = [".mp4"];
var imageExtensions = [".png", ".jpg", ".jpeg"];
function PreviewFile(_a) {
    var _b, _c;
    var file = _a.file, readOnly = _a.readOnly, handleDeleteClick = _a.handleDeleteClick, downloadText = _a.downloadText, openText = _a.openText, preview = _a.preview;
    var url = file.file
        ? URL.createObjectURL(file.file)
        : file.url;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "group relative flex items-center justify-center rounded-md bg-zinc-200 dark:bg-zinc-800", children: [preview &&
                (((_b = file.type) === null || _b === void 0 ? void 0 : _b.startsWith("video")) ||
                    videoExtensions.some(function (e) { return url.endsWith(e); })) ? ((0, jsx_runtime_1.jsx)("video", { className: "max-h-96 rounded-md", src: url, controls: true })) : preview &&
                (((_c = file.type) === null || _c === void 0 ? void 0 : _c.startsWith("image")) ||
                    imageExtensions.some(function (e) { return url.endsWith(e); })) ? (
            // eslint-disable-next-line @next/next/no-img-element
            (0, jsx_runtime_1.jsx)("img", { src: url, alt: file.description, className: "max-h-96 rounded-md" })) : ((0, jsx_runtime_1.jsxs)(Group_1.default, { className: "max-w-full items-center gap-4 p-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "rounded-lg bg-zinc-300 p-2 dark:bg-zinc-800", children: (0, jsx_runtime_1.jsx)(outline_1.DocumentIcon, { className: "h-5 w-5" }) }), (0, jsx_runtime_1.jsxs)(Stack_1.default, { className: "flex-1 gap-1 overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1 truncate", title: file.name, children: file.name }), file.description && (0, jsx_runtime_1.jsx)("div", { children: file.description }), (0, jsx_runtime_1.jsx)(Text_1.default, { size: "sm", children: file.type }), file.size && ((0, jsx_runtime_1.jsx)(Text_1.default, { size: "sm", children: (0, numeral_1.default)(file.size).format("0b") })), !url.startsWith("blob") && ((0, jsx_runtime_1.jsxs)(Group_1.default, { className: "mr-auto", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { leading: (0, jsx_runtime_1.jsx)(solid_1.ArrowTopRightOnSquareIcon, {}), href: url, target: "_blank", children: openText }), (0, jsx_runtime_1.jsx)(Button_1.default, { leading: (0, jsx_runtime_1.jsx)(outline_1.ArrowDownTrayIcon, {}), href: url, download: file.name, children: downloadText })] }))] })] })), !readOnly && ((0, jsx_runtime_1.jsx)(Button_1.default, { icon: true, variant: "filled", color: "default", className: "absolute right-2 top-2 group-hover:opacity-100 sm:opacity-0", onClick: handleDeleteClick, children: (0, jsx_runtime_1.jsx)(solid_1.TrashIcon, {}) }))] }));
}
function FileInput(_a, ref) {
    var _b;
    var _this = this;
    var error = _a.error, className = _a.className, helpText = _a.helpText, onChange = _a.onChange, name = _a.name, limit = _a.limit, label = _a.label, id = _a.id, required = _a.required, onMouseOver = _a.onMouseOver, onMouseOut = _a.onMouseOut, readOnly = _a.readOnly, defaultValue = _a.defaultValue, _c = _a.emptyText, emptyText = _c === void 0 ? "No files" : _c, _d = _a.downloadText, downloadText = _d === void 0 ? "Download" : _d, _e = _a.openText, openText = _e === void 0 ? "Open" : _e, preview = _a.preview, asyncUpload = _a.asyncUpload, onRejectFiles = _a.onRejectFiles, props = __rest(_a, ["error", "className", "helpText", "onChange", "name", "limit", "label", "id", "required", "onMouseOver", "onMouseOut", "readOnly", "defaultValue", "emptyText", "downloadText", "openText", "preview", "asyncUpload", "onRejectFiles"]);
    var _f = __read((0, react_1.useState)(false), 2), uploading = _f[0], setUploading = _f[1];
    var _g = __read((0, react_1.useState)(defaultValue || []), 2), value = _g[0], setValue = _g[1];
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
    var handleAcceptFiles = function (files) { return __awaiter(_this, void 0, void 0, function () {
        var rejectedFilesLimit, acceptedFiles, filesNotUploaded, _loop_1, acceptedFiles_1, acceptedFiles_1_1, file, e_1_1;
        var e_1, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!!asyncUpload) return [3 /*break*/, 1];
                    setValue(function (value) { return __spreadArray(__spreadArray([], __read(value), false), __read(files
                        .filter(function (_file, index) { return !limit || index <= limit - value.length - 1; })
                        .map(function (file) { return ({
                        _id: (0, isomorphicObjectId_1.default)().toString(),
                        name: file.name,
                        file: file,
                        type: file.type,
                        size: file.size,
                    }); })), false); });
                    return [3 /*break*/, 10];
                case 1:
                    setUploading(true);
                    if (onRejectFiles) {
                        rejectedFilesLimit = files.filter(function (_file, index) { return !(!limit || index <= limit - value.length - 1); });
                        if (rejectedFilesLimit.length) {
                            onRejectFiles(rejectedFilesLimit, "limit");
                        }
                    }
                    acceptedFiles = files.filter(function (_file, index) { return !limit || index <= limit - value.length - 1; });
                    filesNotUploaded = [];
                    _loop_1 = function (file) {
                        var uploadedFile_1, e_2;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _c.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, asyncUpload({
                                            _id: (0, isomorphicObjectId_1.default)().toString(),
                                            name: file.name,
                                            file: file,
                                            type: file.type,
                                            size: file.size,
                                        })];
                                case 1:
                                    uploadedFile_1 = _c.sent();
                                    setValue(function (value) { return __spreadArray(__spreadArray([], __read(value), false), [uploadedFile_1], false); });
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_2 = _c.sent();
                                    filesNotUploaded.push(file);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    };
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 7, 8, 9]);
                    acceptedFiles_1 = __values(acceptedFiles), acceptedFiles_1_1 = acceptedFiles_1.next();
                    _b.label = 3;
                case 3:
                    if (!!acceptedFiles_1_1.done) return [3 /*break*/, 6];
                    file = acceptedFiles_1_1.value;
                    return [5 /*yield**/, _loop_1(file)];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5:
                    acceptedFiles_1_1 = acceptedFiles_1.next();
                    return [3 /*break*/, 3];
                case 6: return [3 /*break*/, 9];
                case 7:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 9];
                case 8:
                    try {
                        if (acceptedFiles_1_1 && !acceptedFiles_1_1.done && (_a = acceptedFiles_1.return)) _a.call(acceptedFiles_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 9:
                    if (onRejectFiles && filesNotUploaded.length) {
                        onRejectFiles(filesNotUploaded, "upload-error");
                    }
                    setUploading(false);
                    _b.label = 10;
                case 10: return [2 /*return*/];
            }
        });
    }); };
    (0, react_use_1.useUpdateEffect)(function () {
        if (onChange) {
            onChange({
                target: {
                    name: name,
                    value: value.map(function (file) { return ({
                        _id: file._id,
                        url: file.file
                            ? URL.createObjectURL(file.file)
                            : file.url,
                        description: file.description,
                        name: file.name,
                        type: file.type,
                        size: file.size,
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
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, clsx_1.default)("relative", className, (_b = {},
            _b["error"] = error,
            _b)), onMouseOver: onMouseOver, onMouseOut: onMouseOut, children: [label && ((0, jsx_runtime_1.jsxs)("label", { htmlFor: id, className: Input_1.defaultLabelClassName, children: [label, required && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [" ", (0, jsx_runtime_1.jsx)("span", { className: "text-red-500", children: "*" })] }))] })), (0, jsx_runtime_1.jsxs)("div", { className: (0, clsx_1.default)("grid grid-cols-1 gap-4", {
                    "md:grid-cols-2": !!value.length,
                    "min-h-[140px]": !!value.length || !readOnly,
                }), children: [value.map(function (file, i) { return ((0, jsx_runtime_1.jsx)(PreviewFile, { file: file, readOnly: readOnly, handleDeleteClick: handleDeleteClick(file), downloadText: downloadText, preview: preview, openText: openText }, i)); }), readOnly && !value.length && ((0, jsx_runtime_1.jsx)(Text_1.default, { variant: "secondary", children: emptyText })), !readOnly && (!limit || value.length < limit) && ((0, jsx_runtime_1.jsx)(FileSelect_1.default, __assign({}, props, { id: id, onAcceptFiles: handleAcceptFiles, limit: limit ? limit - value.length : undefined, uploading: uploading, onRejectFiles: onRejectFiles })))] }), helpText && (0, jsx_runtime_1.jsx)("div", { className: Input_1.defaultHelpTextClassName, children: helpText })] }));
}
exports.default = (0, react_1.forwardRef)(FileInput);
