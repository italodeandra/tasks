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
var Button_1 = __importDefault(require("@italodeandra/ui/components/Button"));
var react_1 = require("react");
var router_1 = require("next/router");
var AuthContext_1 = require("../../../AuthContext");
var useTranslation_1 = __importDefault(require("@italodeandra/ui/hooks/useTranslation"));
var Alert_1 = __importDefault(require("@italodeandra/ui/components/Alert"));
var dayjs_1 = __importDefault(require("dayjs"));
var next_seo_1 = require("next-seo");
var Breadcrumbs_1 = __importDefault(require("@italodeandra/ui/components/Breadcrumbs"));
var solid_1 = require("@heroicons/react/20/solid");
var impersonate_1 = require("../../../api/panel/user/impersonate");
var Group_1 = __importDefault(require("@italodeandra/ui/components/Group"));
function PanelUsersView(_a) {
    var disableImpersonate = _a.disableImpersonate;
    var _b = (0, AuthContext_1.useAuthContext)(), Routes = _b.Routes, intl = _b.intl;
    var router = (0, router_1.useRouter)();
    var _c = (0, list_1.useAuthPanelUserList)({
        sort: "createdAt",
        sortDirection: "desc",
    }), data = _c.data, isFetching = _c.isFetching, isError = _c.isError, refetch = _c.refetch;
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
    var _d = (0, impersonate_1.useAuthPanelUserImpersonate)(), impersonate = _d.mutate, isImpersonating = _d.isLoading;
    var pages = (0, react_1.useMemo)(function () { return [{ title: t("Users") }]; }, [t]);
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "mb-2 flex flex-1 flex-col md:px-2" }, { children: [(0, jsx_runtime_1.jsx)(next_seo_1.NextSeo, { title: t("Users") }), (0, jsx_runtime_1.jsxs)(Group_1.default, __assign({ className: "mb-2" }, { children: [(0, jsx_runtime_1.jsx)(Breadcrumbs_1.default, { pages: pages }), (0, jsx_runtime_1.jsx)("div", { className: "flex-grow" }), (0, jsx_runtime_1.jsx)(Group_1.default, __assign({ className: "items-end" }, { children: (0, jsx_runtime_1.jsx)(Button_1.default, __assign({ leading: (0, jsx_runtime_1.jsx)(solid_1.PlusIcon, {}), href: Routes.PanelNewUser }, { children: t("New") })) }))] })), (0, jsx_runtime_1.jsx)(DataTable_1.default, { className: "flex-1", autoHeight: true, columns: columns, data: data, isLoading: isFetching || isImpersonating, onRowClick: handleRowClick, noRecords: !isFetching && isError ? ((0, jsx_runtime_1.jsx)(Alert_1.default, { title: t("There was an unexpected error trying to list the users"), variant: "error", className: "m-2", actions: (0, jsx_runtime_1.jsx)(Button_1.default, __assign({ variant: "text", color: "error", onClick: function () { return refetch(); } }, { children: t("Try again") })) })) : (t("No records")), actions: !disableImpersonate
                    ? [
                        {
                            icon: (0, jsx_runtime_1.jsx)(solid_1.IdentificationIcon, {}),
                            title: t("Impersonate"),
                            onClick: impersonate,
                        },
                    ]
                    : undefined })] })));
}
exports.default = PanelUsersView;
