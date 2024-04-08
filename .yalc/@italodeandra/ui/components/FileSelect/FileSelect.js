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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSelectProvider = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var clsx_1 = __importDefault(require("../../utils/clsx"));
var react_dnd_1 = require("react-dnd");
var react_dnd_html5_backend_1 = require("react-dnd-html5-backend");
var numeral_1 = __importDefault(require("numeral"));
var solid_1 = require("@heroicons/react/24/solid");
var outline_1 = require("@heroicons/react/24/outline");
var Loading_1 = __importDefault(require("../Loading"));
var translateAllowedType = function (type) {
    return ({
        "image/png": "PNG",
        ".png": "PNG",
        "image/jpeg": "JPG",
        ".jpg": "JPG",
        ".jpeg": "JPG",
        ".gif": "GIF",
        "image/gif": "GIF",
        "video/mp4": "MP4",
        ".mp4": "MP4",
        ".csv": "CSV",
        "audio/mpeg": "MP3",
        "application/pdf": "PDF",
        "text/csv": "CSV",
        "application/msword": "DOC",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PPTX",
        ".webp": "WEBP",
        "image/webp": "WEBP",
    })[type];
};
var defaultIcon = (0, jsx_runtime_1.jsx)(outline_1.DocumentIcon, {});
function checkAllowedFileTypesFn(file, allowedFileTypes) {
    return (!allowedFileTypes ||
        allowedFileTypes.includes(file.type) ||
        allowedFileTypes.some(function (t) { return file.name.endsWith(t); }));
}
function FileSelect(_a, ref) {
    var maxFileSize = _a.maxFileSize, allowedFileTypes = _a.allowedFileTypes, id = _a.id, limit = _a.limit, onAcceptFiles = _a.onAcceptFiles, className = _a.className, _b = _a.uploadAFileText, uploadAFileText = _b === void 0 ? "Upload a file" : _b, _c = _a.orDragAndDropText, orDragAndDropText = _c === void 0 ? "or drag and drop" : _c, _d = _a.upToText, upToText = _d === void 0 ? "up to" : _d, _e = _a.anyFileText, anyFileText = _e === void 0 ? "Any file" : _e, _f = _a.dropFilesHereText, dropFilesHereText = _f === void 0 ? "Drop files here" : _f, _g = _a.uploadingText, uploadingText = _g === void 0 ? "Uploading..." : _g, _h = _a.icon, icon = _h === void 0 ? defaultIcon : _h, uploading = _a.uploading, disabled = _a.disabled, additionalBottomInfo = _a.additionalBottomInfo, onRejectFiles = _a.onRejectFiles, error = _a.error;
    var innerId = (0, react_1.useId)();
    id = id || innerId;
    maxFileSize =
        typeof maxFileSize === "string"
            ? (0, numeral_1.default)(maxFileSize).value() || undefined
            : maxFileSize;
    maxFileSize = maxFileSize || (0, numeral_1.default)("10MB").value() || undefined;
    var checkAllowedFileTypes = (0, react_1.useCallback)(function (file) { return checkAllowedFileTypesFn(file, allowedFileTypes); }, [allowedFileTypes]);
    var handleFileBrowse = function (event) {
        if (!event.target.files) {
            throw Error("Files is falsy");
        }
        var files = Array.from(event.target.files);
        var acceptedFiles = files.filter(function (file) {
            return checkAllowedFileTypes(file) && file.size <= maxFileSize;
        });
        if (onRejectFiles) {
            var rejectedFilesType = files.filter(function (file) { return !checkAllowedFileTypes(file); });
            if (rejectedFilesType.length) {
                onRejectFiles(rejectedFilesType, "type");
            }
            var rejectedFilesSize = files.filter(function (file) { return file.size > maxFileSize; });
            if (rejectedFilesSize.length) {
                onRejectFiles(rejectedFilesSize, "size");
            }
        }
        onAcceptFiles(acceptedFiles);
        event.target.value = "";
    };
    var _j = __read((0, react_1.useState)(false), 2), pasteEnabled = _j[0], setPasteEnabled = _j[1];
    useOnPasteFiles(pasteEnabled, onAcceptFiles, allowedFileTypes);
    var _k = __read((0, react_dnd_1.useDrop)(function () { return ({
        accept: [react_dnd_html5_backend_1.NativeTypes.FILE],
        drop: function (item) {
            if (!disabled) {
                var files = item.files;
                files = files.filter(checkAllowedFileTypes);
                onAcceptFiles(files);
            }
        },
        collect: function (monitor) { return ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }); },
    }); }), 2), _l = _k[0], canDrop = _l.canDrop, isOver = _l.isOver, drop = _k[1];
    return ((0, jsx_runtime_1.jsx)("div", { ref: drop, className: (0, clsx_1.default)("flex justify-center rounded-md border-2 border-dashed px-6 pb-6 pt-5", className, {
            "border-primary-300 dark:border-primary-700": isOver,
            "border-zinc-300 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-600": !disabled && !error,
            "cursor-not-allowed border-zinc-200 dark:border-zinc-800": disabled,
            "border-error-500": error,
        }), onMouseMove: !disabled ? function () { return setPasteEnabled(true); } : undefined, onMouseOut: !disabled ? function () { return setPasteEnabled(false); } : undefined, children: uploading ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center justify-center text-center", children: [(0, jsx_runtime_1.jsx)(Loading_1.default, { className: (0, clsx_1.default)("mb-2 h-10 w-10", {
                        "text-primary-500": isOver,
                    }) }), (0, jsx_runtime_1.jsx)("div", { children: uploadingText })] })) : !canDrop || disabled ? ((0, jsx_runtime_1.jsxs)("div", { className: "relative flex flex-col items-center justify-center space-y-1 text-center", children: [(0, react_1.cloneElement)(icon, {
                    className: (0, clsx_1.default)("mx-auto h-12 w-12 text-zinc-400", icon.props.className),
                }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm", children: [(0, jsx_runtime_1.jsxs)("label", { htmlFor: id, className: (0, clsx_1.default)("relative rounded-md font-medium text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:text-primary-500 dark:ring-offset-slate-900", {
                                "cursor-pointer": !disabled,
                                "cursor-not-allowed": disabled,
                            }), children: [(0, jsx_runtime_1.jsx)("span", { children: uploadAFileText }), !disabled && ((0, jsx_runtime_1.jsx)("input", { id: id, name: id, type: "file", className: "sr-only", accept: allowedFileTypes === null || allowedFileTypes === void 0 ? void 0 : allowedFileTypes.join(","), onChange: handleFileBrowse, multiple: limit !== 1, ref: ref }))] }), (0, jsx_runtime_1.jsx)("span", { className: "pl-1", children: orDragAndDropText })] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-zinc-500", children: [allowedFileTypes
                            ? allowedFileTypes.map(translateAllowedType).join(", ")
                            : anyFileText, " ", upToText, " ", (0, numeral_1.default)(maxFileSize).format("0b")] }), additionalBottomInfo] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center justify-center text-center", children: [(0, jsx_runtime_1.jsx)(solid_1.ArrowUpTrayIcon, { className: (0, clsx_1.default)("mb-2 w-10 text-7xl", {
                        "text-primary-500": isOver,
                    }) }), (0, jsx_runtime_1.jsx)("div", { children: dropFilesHereText })] })) }));
}
exports.default = (0, react_1.forwardRef)(FileSelect);
var useOnPasteFiles = function (enabled, onAcceptFiles, allowedFileTypes) {
    (0, react_1.useEffect)(function () {
        if (enabled) {
            document.onpaste = function (event) {
                var items = 
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (event.clipboardData || event.originalEvent.clipboardData)
                    .items;
                for (var index in items) {
                    var item = items[index];
                    if (item.kind === "file") {
                        var file = item.getAsFile();
                        if (checkAllowedFileTypesFn(file, allowedFileTypes)) {
                            onAcceptFiles([file]);
                        }
                    }
                }
            };
            return function () {
                document.onpaste = null;
            };
        }
    }, [allowedFileTypes, enabled, onAcceptFiles]);
};
function FileSelectProvider(_a) {
    var children = _a.children;
    return (0, jsx_runtime_1.jsx)(react_dnd_1.DndProvider, { backend: react_dnd_html5_backend_1.HTML5Backend, children: children });
}
exports.FileSelectProvider = FileSelectProvider;
