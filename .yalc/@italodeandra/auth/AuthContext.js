"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuthContext = exports.AuthContext = exports.authContextDefaultValue = void 0;
var react_1 = require("react");
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
exports.AuthContext = (0, react_1.createContext)(exports.authContextDefaultValue);
function useAuthContext() {
    return (0, react_1.useContext)(exports.AuthContext);
}
exports.useAuthContext = useAuthContext;
