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
var clsx_1 = __importDefault(require("clsx"));
function DataTable(_a) {
    var title = _a.title, subtitle = _a.subtitle, headerContent = _a.headerContent, data = _a.data, _b = _a.idAccessor, idAccessor = _b === void 0 ? "_id" : _b, actions = _a.actions, columns = _a.columns, isLoading = _a.isLoading, _c = _a.noRecords, noRecordsText = _c === void 0 ? "No records" : _c, onRowClick = _a.onRowClick, rowWrapper = _a.rowWrapper, pagination = _a.pagination, _d = _a.currentPage, currentPage = _d === void 0 ? 0 : _d, onChangePage = _a.onChangePage, totalItems = _a.totalItems, _e = _a.itemsPerPage, itemsPerPage = _e === void 0 ? 0 : _e, className = _a.className, autoHeight = _a.autoHeight;
    var _f = __read((0, react_1.useState)(currentPage), 2), page = _f[0], setPage = _f[1];
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
    return ((0, jsx_runtime_1.jsxs)(Stack_1.default, __assign({ className: (0, clsx_1.default)({
            "flex flex-1 flex-col": autoHeight,
        }, className) }, { children: [(title || subtitle || headerContent) && ((0, jsx_runtime_1.jsx)(Table_1.default.Header, __assign({ title: title, subtitle: subtitle }, { children: headerContent }))), (0, jsx_runtime_1.jsxs)(Table_1.default, __assign({ autoHeight: autoHeight }, { children: [(0, jsx_runtime_1.jsxs)(Table_1.default.Head, { children: [(0, jsx_runtime_1.jsxs)(Table_1.default.Row, { children: [columns.map(function (column, i) { return ((0, jsx_runtime_1.jsx)(Table_1.default.Cell, __assign({ className: column.headerClassName }, { children: column.title }), column.id ||
                                        (typeof column.title === "string" ? column.title : i))); }), actions && (0, jsx_runtime_1.jsx)(Table_1.default.Cell, {})] }), isLoading && ((0, jsx_runtime_1.jsx)("tr", __assign({ className: "absolute top-2 right-3 rounded-full bg-gray-50/50 dark:bg-zinc-800/50" }, { children: (0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsx)(Loading_1.default, {}) }) })))] }), (0, jsx_runtime_1.jsxs)(Table_1.default.Body, { children: [data === null || data === void 0 ? void 0 : data.map(function (item) {
                                var RowComponent = rowWrapper || react_1.Fragment;
                                return ((0, jsx_runtime_1.jsx)(RowComponent, __assign({}, (RowComponent !== react_1.Fragment
                                    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        { item: item }
                                    : {}), { children: (0, jsx_runtime_1.jsxs)(Table_1.default.Row, __assign({ onClick: handleRowClick(item) }, { children: [columns.map(function (column, i) {
                                                var _a;
                                                var value = column.accessor
                                                    ? item[column.accessor]
                                                    : column.render && column.render(item);
                                                return ((0, jsx_runtime_1.jsx)(Table_1.default.Cell, __assign({ className: column.cellClassName, title: ((_a = column.cellClassName) === null || _a === void 0 ? void 0 : _a.includes("max-w")) &&
                                                        typeof value === "string"
                                                        ? value
                                                        : undefined }, { children: value }), column.id ||
                                                    (typeof column.title === "string" ? column.title : i)));
                                            }), actions && ((0, jsx_runtime_1.jsx)(Table_1.default.Cell, __assign({ actions: true }, { children: actions.map(function (action, i) {
                                                    var _a;
                                                    var ActionComponent = action.wrapper || react_1.Fragment;
                                                    return ((0, jsx_runtime_1.jsx)(ActionComponent, __assign({}, (ActionComponent !== react_1.Fragment
                                                        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                            { item: item }
                                                        : {}), { children: (0, jsx_runtime_1.jsx)(Table_1.default.ActionButton, __assign({ title: action.title, onClick: function () { var _a; return (_a = action.onClick) === null || _a === void 0 ? void 0 : _a.call(action, item); }, href: typeof action.href === "function"
                                                                ? (_a = action.href) === null || _a === void 0 ? void 0 : _a.call(action, item)
                                                                : action.href }, { children: action.icon })) }), i));
                                                }) })))] })) }), item[idAccessor]));
                            }), isLoading && !(data === null || data === void 0 ? void 0 : data.length) && ((0, jsx_runtime_1.jsxs)(Table_1.default.Row, { children: [columns.map(function (column, i) { return ((0, jsx_runtime_1.jsx)(Table_1.default.Cell, { children: (0, jsx_runtime_1.jsx)(Skeleton_1.Skeleton, { className: "h-3" }) }, column.id ||
                                        (typeof column.title === "string" ? column.title : i))); }), actions && ((0, jsx_runtime_1.jsx)(Table_1.default.Cell, __assign({ actions: true }, { children: (0, jsx_runtime_1.jsx)(Skeleton_1.Skeleton, { className: "inline-block h-3 w-6" }) })))] })), !isLoading && !(data === null || data === void 0 ? void 0 : data.length) && ((0, jsx_runtime_1.jsx)(Table_1.default.Row, { children: (0, jsx_runtime_1.jsx)(Table_1.default.Cell, __assign({ colSpan: columns.length + (actions ? 1 : 0) }, { children: (0, jsx_runtime_1.jsx)(Text_1.default, __assign({ variant: "secondary" }, { children: noRecordsText })) })) }))] })] })), pagination ? ((0, jsx_runtime_1.jsx)(Table_1.default.FooterWithPagination, { totalItems: totalItems, itemsPerPage: itemsPerPage, currentPage: currentPage, onChangePage: onChangePage })) : undefined] })));
}
exports.default = DataTable;
