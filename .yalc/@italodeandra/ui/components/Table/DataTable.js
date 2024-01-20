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
var react_1 = require("react");
var Loading_1 = __importDefault(require("../Loading"));
var Skeleton_1 = __importDefault(require("../Skeleton"));
var Stack_1 = __importDefault(require("../Stack"));
var Text_1 = __importDefault(require("../Text"));
var Table_1 = __importDefault(require("./Table"));
var clsx_1 = __importDefault(require("../../utils/clsx"));
var solid_1 = require("@heroicons/react/20/solid");
function DataTable(_a) {
    var title = _a.title, subtitle = _a.subtitle, headerContent = _a.headerContent, data = _a.data, _b = _a.idAccessor, idAccessor = _b === void 0 ? "_id" : _b, actions = _a.actions, columns = _a.columns, isLoading = _a.isLoading, _c = _a.noRecords, noRecordsText = _c === void 0 ? "No records" : _c, onRowClick = _a.onRowClick, rowWrapper = _a.rowWrapper, pagination = _a.pagination, _d = _a.currentPage, currentPage = _d === void 0 ? 0 : _d, onChangePage = _a.onChangePage, totalItems = _a.totalItems, _e = _a.itemsPerPage, itemsPerPage = _e === void 0 ? 0 : _e, className = _a.className, autoHeight = _a.autoHeight, onChangeSort = _a.onChangeSort, _f = _a.sort, defaultSort = _f === void 0 ? [] : _f, previousText = _a.previousText, nextText = _a.nextText, showingText = _a.showingText, toText = _a.toText, ofText = _a.ofText, resultsText = _a.resultsText, tableClassName = _a.tableClassName;
    var _g = __read((0, react_1.useState)(defaultSort), 2), sort = _g[0], setSort = _g[1];
    var _h = __read((0, react_1.useState)(currentPage), 2), page = _h[0], setPage = _h[1];
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
    var getColumnSort = (0, react_1.useCallback)(function (id) { return sort.find(function (column) { return id === column[0]; }); }, [sort]);
    var handleColumnClick = (0, react_1.useCallback)(function (id) { return function () {
        var sort = getColumnSort(id) || [
            id,
            null,
        ];
        switch (sort[1]) {
            case "asc":
                sort[1] = "desc";
                break;
            case "desc":
                sort[1] = null;
                break;
            case null:
                sort[1] = "asc";
                break;
        }
        setSort(function (oldSort) {
            var newSort = __spreadArray([], __read(oldSort), false);
            if (sort[1]) {
                var column = newSort.find(function (column) { return column[0] === id; });
                if (column) {
                    column[1] = sort[1];
                }
                else {
                    newSort.push([sort[0], sort[1]]);
                }
                return newSort;
            }
            return newSort.filter(function (column) { return !!column[1]; });
        });
    }; }, [getColumnSort]);
    (0, react_1.useEffect)(function () {
        if (onChangeSort) {
            onChangeSort === null || onChangeSort === void 0 ? void 0 : onChangeSort(sort);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sort]);
    return ((0, jsx_runtime_1.jsxs)(Stack_1.default, { className: (0, clsx_1.default)({
            "flex flex-1 flex-col": autoHeight,
        }, className), children: [(title || subtitle || headerContent) && ((0, jsx_runtime_1.jsx)(Table_1.default.Header, { title: title, subtitle: subtitle, children: headerContent })), (0, jsx_runtime_1.jsxs)(Table_1.default, { autoHeight: autoHeight, className: tableClassName, children: [(0, jsx_runtime_1.jsxs)(Table_1.default.Head, { children: [(0, jsx_runtime_1.jsxs)(Table_1.default.Row, { children: [columns.map(function (column, i) {
                                        var id = column.id ||
                                            (typeof column.title === "string"
                                                ? column.title
                                                : i.toString());
                                        var columnSort = getColumnSort(id);
                                        return ((0, jsx_runtime_1.jsx)(Table_1.default.Cell, { className: column.headerClassName, children: column.sortable ? ((0, jsx_runtime_1.jsxs)("span", { className: "group inline-flex cursor-pointer", onClick: handleColumnClick(id), children: [column.title, (0, jsx_runtime_1.jsx)("span", { className: (0, clsx_1.default)("mb-auto ml-2 flex-none rounded text-zinc-400", {
                                                            "bg-zinc-200 text-zinc-900 group-hover:bg-zinc-300": columnSort === null || columnSort === void 0 ? void 0 : columnSort[1],
                                                            "invisible group-hover:visible group-focus:visible": !(columnSort === null || columnSort === void 0 ? void 0 : columnSort[1]),
                                                        }), children: (0, jsx_runtime_1.jsx)(solid_1.ChevronUpIcon, { className: (0, clsx_1.default)("h-5 w-5", {
                                                                "scale-y-flip": (columnSort === null || columnSort === void 0 ? void 0 : columnSort[1]) === "desc",
                                                            }), "aria-hidden": "true" }) })] })) : (column.title) }, id));
                                    }), actions && (0, jsx_runtime_1.jsx)(Table_1.default.Cell, {})] }), isLoading && ((0, jsx_runtime_1.jsx)("tr", { className: "absolute right-3 top-2 rounded-full bg-zinc-50/50 dark:bg-zinc-800/50", children: (0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsx)(Loading_1.default, {}) }) }))] }), (0, jsx_runtime_1.jsxs)(Table_1.default.Body, { children: [data === null || data === void 0 ? void 0 : data.map(function (item) {
                                var RowComponent = rowWrapper || react_1.Fragment;
                                return ((0, jsx_runtime_1.jsx)(RowComponent, __assign({}, (RowComponent !== react_1.Fragment
                                    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        { item: item }
                                    : {}), { children: (0, jsx_runtime_1.jsxs)(Table_1.default.Row, { onClick: handleRowClick(item), children: [columns.map(function (column, i) {
                                                var _a;
                                                var value = column.accessor
                                                    ? item[column.accessor]
                                                    : column.render && column.render(item);
                                                return ((0, jsx_runtime_1.jsx)(Table_1.default.Cell, { className: column.cellClassName, title: ((_a = column.cellClassName) === null || _a === void 0 ? void 0 : _a.includes("max-w")) &&
                                                        typeof value === "string"
                                                        ? value
                                                        : undefined, children: value }, column.id ||
                                                    (typeof column.title === "string" ? column.title : i)));
                                            }), actions && ((0, jsx_runtime_1.jsx)(Table_1.default.Cell, { actions: true, children: actions.map(function (action, i) {
                                                    var _a;
                                                    var ActionComponent = action.wrapper || react_1.Fragment;
                                                    return ((0, jsx_runtime_1.jsx)(ActionComponent, __assign({}, (ActionComponent !== react_1.Fragment
                                                        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                            { item: item }
                                                        : {}), { children: (0, jsx_runtime_1.jsx)(Table_1.default.ActionButton, { title: action.title, onClick: function () { var _a; return (_a = action.onClick) === null || _a === void 0 ? void 0 : _a.call(action, item); }, href: typeof action.href === "function"
                                                                ? (_a = action.href) === null || _a === void 0 ? void 0 : _a.call(action, item)
                                                                : action.href, target: action.target, children: action.icon }) }), i));
                                                }) }))] }) }), item[idAccessor]));
                            }), isLoading && !(data === null || data === void 0 ? void 0 : data.length) && ((0, jsx_runtime_1.jsxs)(Table_1.default.Row, { children: [columns.map(function (column, i) { return ((0, jsx_runtime_1.jsx)(Table_1.default.Cell, { children: (0, jsx_runtime_1.jsx)(Skeleton_1.default, { className: "h-3" }) }, column.id ||
                                        (typeof column.title === "string" ? column.title : i))); }), actions && ((0, jsx_runtime_1.jsx)(Table_1.default.Cell, { actions: true, children: (0, jsx_runtime_1.jsx)(Skeleton_1.default, { className: "inline-block h-3 w-6" }) }))] })), !isLoading && !(data === null || data === void 0 ? void 0 : data.length) && ((0, jsx_runtime_1.jsx)(Table_1.default.Row, { children: (0, jsx_runtime_1.jsx)(Table_1.default.Cell, { colSpan: columns.length + (actions ? 1 : 0), children: (0, jsx_runtime_1.jsx)(Text_1.default, { variant: "secondary", children: noRecordsText }) }) }))] })] }), pagination ? ((0, jsx_runtime_1.jsx)(Table_1.default.FooterWithPagination, { totalItems: totalItems, itemsPerPage: itemsPerPage, currentPage: currentPage, onChangePage: onChangePage, previousText: previousText, nextText: nextText, showingText: showingText, toText: toText, ofText: ofText, resultsText: resultsText })) : undefined] }));
}
exports.default = DataTable;
