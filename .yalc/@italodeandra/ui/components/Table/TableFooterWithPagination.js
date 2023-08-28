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
var TableFooter_1 = __importDefault(require("./TableFooter"));
var Pagination_1 = __importDefault(require("../Pagination/Pagination"));
var react_1 = require("react");
var Button_1 = __importDefault(require("../Button/Button"));
function TableFooterWithPagination(_a) {
    var itemsPerPage = _a.itemsPerPage, totalItems = _a.totalItems, currentPage = _a.currentPage, onChangePage = _a.onChangePage, _b = _a.previousText, previousText = _b === void 0 ? "Previous" : _b, _c = _a.nextText, nextText = _c === void 0 ? "Next" : _c, _d = _a.showingText, showingText = _d === void 0 ? "Showing" : _d, _e = _a.toText, toText = _e === void 0 ? "to" : _e, _f = _a.ofText, ofText = _f === void 0 ? "of" : _f, _g = _a.resultsText, resultsText = _g === void 0 ? "results" : _g;
    var pageCount = totalItems !== undefined && itemsPerPage !== undefined
        ? Math.floor(totalItems / itemsPerPage)
        : 0;
    var _h = __read((0, react_1.useState)(currentPage), 2), page = _h[0], setPage = _h[1];
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
    var handlePageClick = (0, react_1.useCallback)(function (page) { return function () { return setPage(page); }; }, []);
    var start = (page - 1) * itemsPerPage + 1;
    var end = page * itemsPerPage;
    if (totalItems !== undefined) {
        end = end > totalItems ? totalItems : end;
    }
    return ((0, jsx_runtime_1.jsxs)(TableFooter_1.default, { children: [(0, jsx_runtime_1.jsxs)("div", __assign({ className: "flex flex-1 justify-between sm:hidden" }, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, __assign({ disabled: page === 1, onClick: handlePageClick(page - 1) }, { children: previousText })), (0, jsx_runtime_1.jsx)(Button_1.default, __assign({ disabled: page === pageCount, onClick: handlePageClick(page + 1) }, { children: nextText }))] })), (0, jsx_runtime_1.jsxs)("div", __assign({ className: "hidden sm:flex sm:flex-1 sm:items-center sm:justify-between" }, { children: [(0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("p", __assign({ className: "text-sm text-gray-700 dark:text-zinc-100" }, { children: [showingText, " ", (0, jsx_runtime_1.jsx)("span", __assign({ className: "font-medium" }, { children: start })), " ", toText, " ", (0, jsx_runtime_1.jsx)("span", __assign({ className: "font-medium" }, { children: end })), totalItems !== undefined && itemsPerPage !== undefined && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [" ", ofText, " ", (0, jsx_runtime_1.jsx)("span", __assign({ className: "font-medium" }, { children: totalItems })), " ", resultsText] }))] })) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(Pagination_1.default, { itemsPerPage: itemsPerPage, totalItems: totalItems, currentPage: currentPage, onChangePage: onChangePage }) })] }))] }));
}
exports.default = TableFooterWithPagination;
