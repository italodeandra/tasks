"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var solid_1 = require("@heroicons/react/20/solid");
var react_1 = require("@headlessui/react");
var Stack_1 = __importDefault(require("../Stack"));
function Accordion(_a) {
    var children = _a.children;
    return (0, jsx_runtime_1.jsx)(Stack_1.default, { children: children });
}
exports.default = Accordion;
Accordion.Item = AccordionItem;
function AccordionItem(_a) {
    var children = _a.children, title = _a.title, defaultOpen = _a.defaultOpen;
    return ((0, jsx_runtime_1.jsx)(react_1.Disclosure, { defaultOpen: defaultOpen, children: function (_a) {
            var open = _a.open;
            return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(react_1.Disclosure.Button, { className: "flex w-full justify-between rounded-lg bg-zinc-200 px-4 py-2 text-left text-sm font-medium hover:bg-zinc-300 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 dark:bg-zinc-800 dark:hover:bg-zinc-700", children: [title, (0, jsx_runtime_1.jsx)(solid_1.ChevronUpIcon, { className: "".concat(open ? "rotate-180 transform" : "", " h-5 w-5") })] }), (0, jsx_runtime_1.jsx)(react_1.Disclosure.Panel, { className: "px-4 pt-2 pb-2", children: children })] }));
        } }));
}
