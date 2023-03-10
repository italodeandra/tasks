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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var Button_1 = __importDefault(require("@italodeandra/ui/components/Button/Button"));
var Input_1 = __importDefault(require("@italodeandra/ui/components/Input/Input"));
var Text_1 = __importDefault(require("@italodeandra/ui/components/Text/Text"));
var AuthLayout_1 = __importDefault(require("./AuthLayout/AuthLayout"));
var useTranslation_1 = __importDefault(require("@italodeandra/ui/hooks/useTranslation"));
var next_seo_1 = require("next-seo");
var react_hook_form_1 = require("react-hook-form");
var router_1 = require("next/router");
var Stack_1 = __importDefault(require("@italodeandra/ui/components/Stack/Stack"));
var react_1 = require("react");
var resetPassword_1 = require("../api/resetPassword");
var AuthContext_1 = require("../AuthContext");
function ResetPasswordView(_a) {
    var _b;
    var backgroundImage = _a.backgroundImage;
    var _c = (0, AuthContext_1.useAuthContext)(), Routes = _c.Routes, intl = _c.intl;
    var t = (0, useTranslation_1.default)(intl);
    var router = (0, router_1.useRouter)();
    var token = router.query.token;
    var email = (0, react_1.useMemo)(function () {
        try {
            return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString("binary")).email;
        }
        catch (e) {
            return "";
        }
    }, [token]);
    var _d = (0, react_hook_form_1.useForm)(), register = _d.register, handleSubmit = _d.handleSubmit, errors = _d.formState.errors, setError = _d.setError;
    var _e = (0, resetPassword_1.useAuthResetPassword)({
        onError: function (error) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (error.status === "TokenExpired") {
                        setError("newPassword", {
                            message: t("Your token expired. To generate a new one, make a new request to reset your password."),
                        });
                        return [2 /*return*/];
                    }
                    console.error(error);
                    setError("newPassword", {
                        message: t("There was an unexpected error. Try again later."),
                    });
                    return [2 /*return*/];
                });
            });
        },
    }), resetPassword = _e.mutate, isResettingPassword = _e.isLoading, wasPasswordReset = _e.isSuccess;
    function onSubmit(data) {
        if (!isResettingPassword) {
            resetPassword(__assign(__assign({}, data), { token: token }));
        }
    }
    if (wasPasswordReset) {
        return ((0, jsx_runtime_1.jsxs)(AuthLayout_1.default, __assign({ title: t("Password reset successfully") }, { children: [(0, jsx_runtime_1.jsx)(next_seo_1.NextSeo, { title: t("Reset password") }), (0, jsx_runtime_1.jsx)(Stack_1.default, { children: (0, jsx_runtime_1.jsxs)(Text_1.default, __assign({ variant: "secondary" }, { children: [t("Click"), " ", (0, jsx_runtime_1.jsx)(Text_1.default, __assign({ variant: "link", href: Routes.SignIn }, { children: t("here") })), " ", t("to sign in"), "."] })) })] })));
    }
    return ((0, jsx_runtime_1.jsxs)(AuthLayout_1.default, __assign({ title: t("Reset your password"), subtitle: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [t("Or"), " ", (0, jsx_runtime_1.jsx)(Text_1.default, __assign({ variant: "link", href: Routes.SignIn }, { children: t("sign in to your account") })), " ", t("if you remembered the password")] }), backgroundImage: backgroundImage }, { children: [(0, jsx_runtime_1.jsx)(next_seo_1.NextSeo, { title: t("Reset password") }), (0, jsx_runtime_1.jsx)("form", __assign({ onSubmit: handleSubmit(onSubmit) }, { children: (0, jsx_runtime_1.jsxs)(Stack_1.default, __assign({ className: "gap-5" }, { children: [(0, jsx_runtime_1.jsx)(Input_1.default, { label: t("Email"), value: email, readOnly: true }), (0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: t("New password"), type: "password", autoComplete: "new-password", required: true }, register("newPassword", {
                            required: t("Please fill with the new password"),
                        }), { error: !!errors.newPassword, helpText: (_b = errors.newPassword) === null || _b === void 0 ? void 0 : _b.message })), (0, jsx_runtime_1.jsx)(Button_1.default, __assign({ type: "submit", variant: "filled", className: "w-full", loading: isResettingPassword }, { children: t("Reset password") }))] })) }))] })));
}
exports.default = ResetPasswordView;
