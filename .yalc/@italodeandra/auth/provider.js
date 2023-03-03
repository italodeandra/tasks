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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuthContext = exports.authContextDefaultValue = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var Notifications_1 = __importDefault(require("@italodeandra/ui/components/Notifications/Notifications"));
exports.authContextDefaultValue = {
    Routes: {
        SignUp: "/sign-up",
        ForgotPassword: "/forgot-password",
        Home: "/",
        SignIn: "/sign-in",
        ResetPassword: function (token) { return "/reset-password/".concat(token); },
        Panel: "/panel",
        PanelUser: function (id) { return "/panel/user/".concat(id); },
        PanelUsers: "/panel/users",
        PanelNewUser: "/panel/user/new",
    },
};
var AuthContext = (0, react_1.createContext)(exports.authContextDefaultValue);
var AuthProvider = function (_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    return ((0, jsx_runtime_1.jsxs)(AuthContext.Provider, __assign({ value: props }, { children: [(0, jsx_runtime_1.jsx)(Notifications_1.default, {}), children] })));
};
function useAuthContext() {
    return (0, react_1.useContext)(AuthContext);
}
exports.useAuthContext = useAuthContext;
exports.default = AuthProvider;
