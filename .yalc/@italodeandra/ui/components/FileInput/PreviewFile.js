"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreviewFile = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var Group_1 = __importDefault(require("../Group"));
var outline_1 = require("@heroicons/react/24/outline");
var Stack_1 = __importDefault(require("../Stack"));
var Text_1 = __importDefault(require("../Text/Text"));
var numeral_1 = __importDefault(require("numeral"));
var Button_1 = __importDefault(require("../Button"));
var solid_1 = require("@heroicons/react/20/solid");
var videoExtensions = [".mp4"];
var imageExtensions = [".png", ".jpg", ".jpeg", ".webp"];
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
            (0, jsx_runtime_1.jsx)("img", { src: url, alt: file.description, className: "max-h-96 rounded-md" })) : ((0, jsx_runtime_1.jsxs)(Group_1.default, { className: "max-w-full items-center gap-4 p-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "rounded-lg bg-zinc-300 p-2 dark:bg-zinc-800", children: (0, jsx_runtime_1.jsx)(outline_1.DocumentIcon, { className: "h-5 w-5" }) }), (0, jsx_runtime_1.jsxs)(Stack_1.default, { className: "flex-1 gap-1 overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1 truncate", title: file.name, children: file.name }), file.description && (0, jsx_runtime_1.jsx)("div", { children: file.description }), (0, jsx_runtime_1.jsx)(Text_1.default, { size: "sm", children: file.type }), !!file.size && ((0, jsx_runtime_1.jsx)(Text_1.default, { size: "sm", children: (0, numeral_1.default)(file.size).format("0b") })), !url.startsWith("blob") && ((0, jsx_runtime_1.jsxs)(Group_1.default, { className: "mr-auto", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { leading: (0, jsx_runtime_1.jsx)(solid_1.ArrowTopRightOnSquareIcon, {}), href: url, target: "_blank", children: openText }), (0, jsx_runtime_1.jsx)(Button_1.default, { leading: (0, jsx_runtime_1.jsx)(outline_1.ArrowDownTrayIcon, {}), href: url, download: file.name, children: downloadText })] }))] })] })), !readOnly && ((0, jsx_runtime_1.jsx)(Button_1.default, { icon: true, variant: "filled", color: "default", className: "absolute right-2 top-2 group-hover:opacity-100 sm:opacity-0", onClick: handleDeleteClick, children: (0, jsx_runtime_1.jsx)(solid_1.TrashIcon, {}) }))] }));
}
exports.PreviewFile = PreviewFile;
