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
exports.FileSelectProvider = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var clsx_1 = __importDefault(require("clsx"));
var react_dnd_1 = require("react-dnd");
var react_dnd_html5_backend_1 = require("react-dnd-html5-backend");
var numeral_1 = __importDefault(require("numeral"));
var solid_1 = require("@heroicons/react/24/solid");
var translateAllowedType = function (type) {
    return ({
        "image/png": "PNG",
        ".png": "PNG",
        "image/jpeg": "JPG",
        ".jpg": "JPG",
        ".jpeg": "JPG",
        ".gif": "GIF",
        "image/gif": "GIF",
        image: "Image",
        video: "Video",
        "video/mp4": "MP4",
        ".mp4": "MP4",
    }[type]);
};
var defaultIcon = ((0, jsx_runtime_1.jsx)("svg", __assign({ stroke: "currentColor", fill: "none", viewBox: "0 0 48 48", "aria-hidden": "true" }, { children: (0, jsx_runtime_1.jsx)("path", { d: "M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }) })));
function FileSelect(_a, ref) {
    var maxFileSize = _a.maxFileSize, allowedFileTypes = _a.allowedFileTypes, id = _a.id, limit = _a.limit, onAcceptFiles = _a.onAcceptFiles, className = _a.className, _b = _a.uploadAFileText, uploadAFileText = _b === void 0 ? "Upload a file" : _b, _c = _a.orDragAndDropText, orDragAndDropText = _c === void 0 ? "or drag and drop" : _c, _d = _a.upToText, upToText = _d === void 0 ? "up to" : _d, _e = _a.anyFileText, anyFileText = _e === void 0 ? "Any file" : _e, _f = _a.dropFilesHereText, dropFilesHereText = _f === void 0 ? "Drop files here" : _f, _g = _a.icon, icon = _g === void 0 ? defaultIcon : _g;
    var innerId = (0, react_1.useId)();
    id = id || innerId;
    maxFileSize =
        typeof maxFileSize === "string"
            ? (0, numeral_1.default)(maxFileSize).value() || undefined
            : maxFileSize;
    maxFileSize = maxFileSize || (0, numeral_1.default)("10MB").value() || undefined;
    var handleFileBrowse = function (event) {
        if (!event.target.files) {
            throw Error("Files is falsy");
        }
        var files = Array.from(event.target.files);
        files = files.filter(function (file) { return !allowedFileTypes || allowedFileTypes.includes(file.type); });
        onAcceptFiles(files);
        event.target.value = "";
    };
    useOnPasteFiles(onAcceptFiles, allowedFileTypes);
    var _h = __read((0, react_dnd_1.useDrop)(function () { return ({
        accept: [react_dnd_html5_backend_1.NativeTypes.FILE],
        drop: function (item) {
            var files = item.files;
            files = files.filter(function (file) { return !allowedFileTypes || allowedFileTypes.includes(file.type); });
            onAcceptFiles(files);
        },
        collect: function (monitor) { return ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }); },
    }); }), 2), _j = _h[0], canDrop = _j.canDrop, isOver = _j.isOver, drop = _h[1];
    return ((0, jsx_runtime_1.jsx)("div", __assign({ ref: drop, className: (0, clsx_1.default)("flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 dark:border-gray-700", className, {
            "border-primary-300 dark:border-primary-700": isOver,
        }) }, { children: !canDrop ? ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "relative flex flex-col items-center justify-center space-y-1 text-center" }, { children: [(0, react_1.cloneElement)(icon, {
                    className: (0, clsx_1.default)("mx-auto h-12 w-12 text-gray-400", icon.props.className),
                }), (0, jsx_runtime_1.jsxs)("div", __assign({ className: "text-sm" }, { children: [(0, jsx_runtime_1.jsxs)("label", __assign({ htmlFor: id, className: "relative cursor-pointer rounded-md font-medium text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:text-primary-500 dark:ring-offset-slate-900" }, { children: [(0, jsx_runtime_1.jsx)("span", { children: uploadAFileText }), (0, jsx_runtime_1.jsx)("input", { id: id, name: id, type: "file", className: "sr-only", accept: allowedFileTypes === null || allowedFileTypes === void 0 ? void 0 : allowedFileTypes.join(","), onChange: handleFileBrowse, multiple: limit !== 1, ref: ref })] })), (0, jsx_runtime_1.jsx)("span", __assign({ className: "pl-1" }, { children: orDragAndDropText }))] })), (0, jsx_runtime_1.jsxs)("p", __assign({ className: "text-xs text-gray-500" }, { children: [allowedFileTypes
                            ? allowedFileTypes.map(translateAllowedType).join(", ")
                            : anyFileText, " ", upToText, " ", (0, numeral_1.default)(maxFileSize).format("0b")] }))] }))) : ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "flex flex-col items-center justify-center text-center" }, { children: [(0, jsx_runtime_1.jsx)(solid_1.ArrowUpTrayIcon, { className: (0, clsx_1.default)("mb-2 w-10 text-7xl", {
                        "text-primary-500": isOver,
                    }) }), (0, jsx_runtime_1.jsx)("div", { children: dropFilesHereText })] }))) })));
}
exports.default = (0, react_1.forwardRef)(FileSelect);
var useOnPasteFiles = function (onAcceptFiles, allowedFileTypes) {
    (0, react_1.useEffect)(function () {
        document.onpaste = function (event) {
            var items = 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (event.clipboardData || event.originalEvent.clipboardData)
                .items;
            for (var index in items) {
                var item = items[index];
                if (item.kind === "file") {
                    var file = item.getAsFile();
                    if (!allowedFileTypes || allowedFileTypes.includes(file.type)) {
                        onAcceptFiles([file]);
                    }
                }
            }
        };
        return function () {
            document.onpaste = null;
        };
    }, [allowedFileTypes, onAcceptFiles]);
};
function FileSelectProvider(_a) {
    var children = _a.children;
    return (0, jsx_runtime_1.jsx)(react_dnd_1.DndProvider, __assign({ backend: react_dnd_html5_backend_1.HTML5Backend }, { children: children }));
}
exports.FileSelectProvider = FileSelectProvider;
