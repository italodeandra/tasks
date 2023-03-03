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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var list_1 = require("../../../api/panel/user/list");
var DataTable_1 = __importDefault(require("@italodeandra/ui/components/Table/DataTable"));
var User_service_1 = require("../../../collections/user/User.service");
var Button_1 = __importDefault(require("@italodeandra/ui/components/Button/Button"));
var react_1 = require("react");
var router_1 = require("next/router");
var provider_1 = require("../../../provider");
var useTranslation_1 = __importDefault(require("@italodeandra/ui/hooks/useTranslation"));
var Alert_1 = __importDefault(require("@italodeandra/ui/components/Alert/Alert"));
var dayjs_1 = __importDefault(require("dayjs"));
var next_seo_1 = require("next-seo");
var Breadcrumbs_1 = __importDefault(require("@italodeandra/ui/components/Breadcrumbs/Breadcrumbs"));
function PanelUsersView() {
    var _a = (0, provider_1.useAuthContext)(), Routes = _a.Routes, intl = _a.intl;
    var router = (0, router_1.useRouter)();
    var _b = (0, list_1.useAuthPanelUserList)({
        sort: "createdAt",
        sortDirection: "desc",
    }), data = _b.data, isFetching = _b.isFetching, isError = _b.isError, refetch = _b.refetch;
    var t = (0, useTranslation_1.default)(intl);
    var columns = (0, react_1.useMemo)(function () { return [
        {
            title: t("Name"),
            accessor: "name",
        },
        {
            title: t("Email"),
            accessor: "email",
        },
        {
            title: t("Type"),
            render: function (_a) {
                var type = _a.type;
                return t((0, User_service_1.translateUserType)(type));
            },
        },
        {
            title: t("Created at"),
            render: function (_a) {
                var createdAt = _a.createdAt;
                return (0, dayjs_1.default)(createdAt).format("lll");
            },
        },
        {
            title: t("Updated at"),
            render: function (_a) {
                var updatedAt = _a.updatedAt;
                return (0, dayjs_1.default)(updatedAt).format("lll");
            },
        },
    ]; }, [t]);
    var handleRowClick = (0, react_1.useCallback)(function (item) {
        return router.push(Routes.PanelUser(item._id));
    }, [router, Routes]);
    var pages = (0, react_1.useMemo)(function () { return [{ title: t("Users") }]; }, [t]);
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "md:px-2" }, { children: [(0, jsx_runtime_1.jsx)(next_seo_1.NextSeo, { title: t("Users") }), (0, jsx_runtime_1.jsx)(Breadcrumbs_1.default, { pages: pages, className: "mb-5" }), (0, jsx_runtime_1.jsx)(DataTable_1.default, { title: t("Users"), columns: columns, data: data, isLoading: isFetching, headerContent: (0, jsx_runtime_1.jsx)(Button_1.default, __assign({ href: Routes.PanelNewUser }, { children: t("Add user") })), onRowClick: handleRowClick, noRecords: !isFetching && isError ? ((0, jsx_runtime_1.jsx)(Alert_1.default, { title: t("There was an unexpected error trying to list the users"), variant: "error", className: "m-2", actions: (0, jsx_runtime_1.jsx)(Button_1.default, __assign({ variant: "text", color: "error", onClick: refetch }, { children: t("Try again") })) })) : (t("No records")) })] })));
}
exports.default = PanelUsersView;
