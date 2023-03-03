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
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var Loading_1 = __importDefault(require("../Loading/Loading"));
var Skeleton_1 = require("../Skeleton/Skeleton");
var Stack_1 = __importDefault(require("../Stack/Stack"));
var Text_1 = __importDefault(require("../Text/Text"));
var Table_1 = __importDefault(require("./Table"));
function DataTable(_a) {
    var title = _a.title, subtitle = _a.subtitle, headerContent = _a.headerContent, data = _a.data, _b = _a.idAccessor, idAccessor = _b === void 0 ? "_id" : _b, actions = _a.actions, columns = _a.columns, isLoading = _a.isLoading, _c = _a.noRecords, noRecordsText = _c === void 0 ? "No records" : _c, onRowClick = _a.onRowClick, pagination = _a.pagination, _d = _a.currentPage, currentPage = _d === void 0 ? 0 : _d, onChangePage = _a.onChangePage, _e = _a.totalItems, totalItems = _e === void 0 ? 0 : _e, _f = _a.itemsPerPage, itemsPerPage = _f === void 0 ? 15 : _f, className = _a.className;
    var _g = __read((0, react_1.useState)(currentPage), 2), page = _g[0], setPage = _g[1];
    (0, react_1.useEffect)(function () {
        if (page !== currentPage) {
            setPage(currentPage);
        }
    }, [currentPage, page]);
    (0, react_1.useEffect)(function () {
        if (onChangePage) {
            onChangePage(page);
        }
    }, [onChangePage, page]);
    var handleRowClick = (0, react_1.useCallback)(function (item) { return (onRowClick ? function () { return onRowClick(item); } : undefined); }, [onRowClick]);
    return ((0, jsx_runtime_1.jsxs)(Stack_1.default, __assign({ className: className }, { children: [(title || subtitle || headerContent) && ((0, jsx_runtime_1.jsx)(Table_1.default.Header, __assign({ title: title, subtitle: subtitle }, { children: headerContent }))), (0, jsx_runtime_1.jsxs)(Table_1.default, __assign({ className: "relative" }, { children: [(0, jsx_runtime_1.jsxs)(Table_1.default.Head, { children: [(0, jsx_runtime_1.jsxs)(Table_1.default.Row, { children: [columns.map(function (column, i) { return ((0, jsx_runtime_1.jsx)(Table_1.default.Cell, { children: column.title }, column.id ||
                                        (typeof column.title === "string" ? column.title : i))); }), actions && (0, jsx_runtime_1.jsx)(Table_1.default.Cell, {})] }), isLoading && ((0, jsx_runtime_1.jsx)("tr", __assign({ className: "absolute top-3.5 right-3 rounded-full bg-gray-50/50 dark:bg-zinc-800/50" }, { children: (0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsx)(Loading_1.default, {}) }) })))] }), (0, jsx_runtime_1.jsxs)(Table_1.default.Body, { children: [data === null || data === void 0 ? void 0 : data.map(function (item) { return ((0, jsx_runtime_1.jsxs)(Table_1.default.Row, __assign({ onClick: handleRowClick(item) }, { children: [columns.map(function (column, i) { return ((0, jsx_runtime_1.jsxs)(Table_1.default.Cell, { children: [column.accessor && item[column.accessor], !column.accessor && column.render && column.render(item)] }, column.id ||
                                        (typeof column.title === "string" ? column.title : i))); }), actions && ((0, jsx_runtime_1.jsx)(Table_1.default.Cell, __assign({ actions: true }, { children: actions.map(function (action, i) { return ((0, jsx_runtime_1.jsx)(Table_1.default.ActionButton, __assign({ title: action.title }, { children: action.icon }), i)); }) })))] }), item[idAccessor])); }), isLoading && !(data === null || data === void 0 ? void 0 : data.length) && ((0, jsx_runtime_1.jsxs)(Table_1.default.Row, { children: [columns.map(function (column, i) { return ((0, jsx_runtime_1.jsx)(Table_1.default.Cell, { children: (0, jsx_runtime_1.jsx)(Skeleton_1.Skeleton, { className: "h-2" }) }, column.id ||
                                        (typeof column.title === "string" ? column.title : i))); }), actions && ((0, jsx_runtime_1.jsx)(Table_1.default.Cell, __assign({ actions: true }, { children: (0, jsx_runtime_1.jsx)(Skeleton_1.Skeleton, { className: "inline-block h-2 w-6" }) })))] })), !isLoading && !(data === null || data === void 0 ? void 0 : data.length) && ((0, jsx_runtime_1.jsx)(Table_1.default.Row, { children: (0, jsx_runtime_1.jsx)(Table_1.default.Cell, __assign({ colSpan: columns.length + (actions ? 1 : 0) }, { children: (0, jsx_runtime_1.jsx)(Text_1.default, __assign({ variant: "secondary" }, { children: noRecordsText })) })) }))] })] })), pagination ? ((0, jsx_runtime_1.jsx)(Table_1.default.FooterWithPagination, { totalItems: totalItems, itemsPerPage: itemsPerPage, currentPage: currentPage, onChangePage: onChangePage })) : undefined] })));
}
exports.default = DataTable;
