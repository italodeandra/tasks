/// <reference types="react" />
import Routes from "./Routes";
export declare type IAuthContext = {
    Routes: Routes;
    intl?: {
        "There was an unexpected error. Try again later."?: string;
        "Check your email inbox"?: string;
        "We sent a link to"?: string;
        "Reset password"?: string;
        "Click the link we sent you to create a new password"?: string;
        "Did you remember your password?"?: string;
        "Sign in"?: string;
        "to your account"?: string;
        "Reset your password"?: string;
        Or?: string;
        "sign in to your account"?: string;
        "if you remembered the password"?: string;
        Email?: string;
        "Please fill with your email"?: string;
        "Please fill with a valid email"?: string;
        "Your token expired. To generate a new one, make a new request to reset your password."?: string;
        "New password"?: string;
        "Please fill with the new password"?: string;
        "User not found or incorrect password"?: string;
        "Sign in to your account"?: string;
        "create a new account"?: string;
        Password?: string;
        "Please fill with your password"?: string;
        "Forgot your password?"?: string;
        "An user with the same email already exists"?: string;
        "Create a new account"?: string;
        "Sign up"?: string;
        Users?: string;
        "Add user"?: string;
        Name?: string;
        Type?: string;
        Administrator?: string;
        Normal?: string;
        "No records"?: string;
        "Try again"?: string;
        "There was an unexpected error trying to list the users"?: string;
        User?: string;
        "New user"?: string;
        "Please fill with an email"?: string;
        Save?: string;
        Saved?: string;
        "It was not possible to create the user"?: string;
        "It was not possible to update the user"?: string;
        "Created at"?: string;
        "Updated at"?: string;
    } & Record<string, string>;
};
export declare const authContextDefaultValue: {
    Routes: {
        SignUp: string;
        ForgotPassword: string;
        Home: string;
        SignIn: string;
        ResetPassword: (token: string) => string;
        Panel: string;
        PanelUser: (id: string) => string;
        PanelUsers: string;
        PanelNewUser: string;
    };
};
export declare const AuthContext: import("react").Context<IAuthContext>;
export declare function useAuthContext(): IAuthContext;
