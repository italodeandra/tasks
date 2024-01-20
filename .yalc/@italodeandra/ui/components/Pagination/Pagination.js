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
var jsx_runtime_1 = require("react/jsx-runtime");
var solid_1 = require("@heroicons/react/20/solid");
var react_1 = require("react");
var clsx_1 = __importDefault(require("../../utils/clsx"));
var lodash_1 = require("lodash");
function Pagination(_a) {
    var totalItems = _a.totalItems, itemsPerPage = _a.itemsPerPage, currentPage = _a.currentPage, onChangePage = _a.onChangePage, className = _a.className;
    var _b = __read((0, react_1.useState)(currentPage), 2), page = _b[0], setPage = _b[1];
    (0, react_1.useEffect)(function () {
        if (page !== currentPage) {
            setPage(currentPage);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);
    (0, react_1.useEffect)(function () {
        if (onChangePage) {
            onChangePage(page);
        }
    }, [onChangePage, page]);
    var _c = __read((0, react_1.useState)(totalItems || 0), 2), previousTotalItems = _c[0], setPreviousTotalItems = _c[1];
    (0, react_1.useEffect)(function () {
        if (totalItems) {
            setPreviousTotalItems(totalItems);
        }
    }, [totalItems]);
    var pageCount = itemsPerPage !== undefined
        ? Math.ceil(previousTotalItems / itemsPerPage) || 1
        : 0;
    var pages = (0, react_1.useMemo)(function () {
        if (pageCount < 7) {
            return (0, lodash_1.range)(1, pageCount + 1);
        }
        if (page < 5) {
            return [1, 2, 3, 4, 5, "...1", pageCount];
        }
        if (page > pageCount - 4) {
            return [
                1,
                "...1",
                pageCount - 4,
                pageCount - 3,
                pageCount - 2,
                pageCount - 1,
                pageCount,
            ];
        }
        return [1, "...1", page - 1, page, page + 1, "...2", pageCount];
    }, [page, pageCount]);
    var handlePageClick = (0, react_1.useCallback)(function (page) { return function () { return setPage(page); }; }, []);
    return ((0, jsx_runtime_1.jsxs)("nav", { className: (0, clsx_1.default)("ui-pagination", className), "aria-label": "Pagination", children: [(0, jsx_runtime_1.jsxs)("button", { disabled: page === 1, onClick: handlePageClick(page - 1), children: [(0, jsx_runtime_1.jsx)("span", { className: "sr-only", children: "Previous" }), (0, jsx_runtime_1.jsx)(solid_1.ChevronLeftIcon, { className: "h-5 w-5", "aria-hidden": "true" })] }), pages.map(function (p) {
                return typeof p === "number" ? ((0, jsx_runtime_1.jsx)("button", { onClick: handlePageClick(p), "data-active": page === p ? "" : undefined, children: p }, p)) : ((0, jsx_runtime_1.jsx)("button", { disabled: true, children: "..." }, p));
            }), (0, jsx_runtime_1.jsxs)("button", { disabled: page === pageCount, onClick: handlePageClick(page + 1), children: [(0, jsx_runtime_1.jsx)("span", { className: "sr-only", children: "Next" }), (0, jsx_runtime_1.jsx)(solid_1.ChevronRightIcon, { className: "h-5 w-5", "aria-hidden": "true" })] })] }));
}
exports.default = Pagination;
