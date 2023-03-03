/// <reference types="node" />
import { UnstyledButtonProps } from "./UnstyledButton";
import { ReactElement } from "react";
declare const styles: {
    root: string;
    variant: {
        filled: string;
        light: string;
        outlined: string;
        text: string;
    };
    color: {
        primary: string;
        success: string;
        error: string;
        gray: string;
        white: string;
    };
    variantColor: {
        "filled-primary": string;
        "filled-success": string;
        "filled-error": string;
        "filled-gray": string;
        "filled-white": string;
        "light-primary": string;
        "light-success": string;
        "light-error": string;
        "light-gray": string;
        "light-white": string;
        "outlined-primary": string;
        "outlined-success": string;
        "outlined-error": string;
        "outlined-gray": string;
        "outlined-white": string;
        "text-primary": string;
        "text-success": string;
        "text-error": string;
        "text-gray": string;
        "text-white": string;
    };
    disabled: string;
    size: {
        md: {
            button: string;
            icon: string;
        };
        sm: {
            button: string;
            icon: string;
        };
    };
    icon: {
        md: {
            button: string;
            icon: string;
        };
        sm: {
            button: string;
            icon: string;
        };
    };
};
export declare type ButtonProps<Href extends string | undefined> = UnstyledButtonProps<Href> & {
    variant?: keyof typeof styles["variant"];
    color?: keyof typeof styles["color"];
    size?: keyof typeof styles["size"];
    icon?: boolean;
    leadingIcon?: ReactElement;
    trailingIcon?: ReactElement;
    loading?: boolean;
    disabled?: boolean;
};
declare const _default: import("react").ForwardRefExoticComponent<{
    href?: string | undefined;
    target?: string | undefined;
} & Omit<import("react").DetailedHTMLProps<import("react").ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> | (Omit<import("react").AnchorHTMLAttributes<HTMLAnchorElement>, keyof {
    href: string | import("url").UrlObject;
    as?: (string | import("url").UrlObject) | undefined;
    replace?: boolean | undefined;
    scroll?: boolean | undefined;
    shallow?: boolean | undefined;
    passHref?: boolean | undefined;
    prefetch?: boolean | undefined;
    locale?: string | false | undefined;
    legacyBehavior?: boolean | undefined;
    onMouseEnter?: ((e: any) => void) | undefined;
    onTouchStart?: ((e: any) => void) | undefined;
    onClick?: ((e: any) => void) | undefined;
}> & {
    href: string | import("url").UrlObject;
    as?: (string | import("url").UrlObject) | undefined;
    replace?: boolean | undefined;
    scroll?: boolean | undefined;
    shallow?: boolean | undefined;
    passHref?: boolean | undefined;
    prefetch?: boolean | undefined;
    locale?: string | false | undefined;
    legacyBehavior?: boolean | undefined;
    onMouseEnter?: ((e: any) => void) | undefined;
    onTouchStart?: ((e: any) => void) | undefined;
    onClick?: ((e: any) => void) | undefined;
} & {
    children?: import("react").ReactNode;
} & import("react").RefAttributes<HTMLAnchorElement>), "ref"> & {
    variant?: "text" | "light" | "filled" | "outlined" | undefined;
    color?: "success" | "error" | "primary" | "gray" | "white" | undefined;
    size?: "sm" | "md" | undefined;
    icon?: boolean | undefined;
    leadingIcon?: ReactElement<any, string | import("react").JSXElementConstructor<any>> | undefined;
    trailingIcon?: ReactElement<any, string | import("react").JSXElementConstructor<any>> | undefined;
    loading?: boolean | undefined;
    disabled?: boolean | undefined;
} & import("react").RefAttributes<HTMLAnchorElement | HTMLButtonElement>>;
export default _default;
