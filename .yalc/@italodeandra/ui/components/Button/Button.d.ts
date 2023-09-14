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
        custom: string;
    };
    color: {
        primary: string;
        success: string;
        error: string;
        gray: string;
        default: string;
    };
    variantColor: {
        "filled-primary": string;
        "filled-success": string;
        "filled-error": string;
        "filled-gray": string;
        "filled-default": string;
        "light-primary": string;
        "light-success": string;
        "light-error": string;
        "light-gray": string;
        "light-default": string;
        "outlined-primary": string;
        "outlined-success": string;
        "outlined-error": string;
        "outlined-gray": string;
        "outlined-default": string;
        "text-primary": string;
        "text-success": string;
        "text-error": string;
        "text-gray": string;
        "text-default": string;
    };
    disabled: string;
    size: {
        xs: {
            button: string;
        };
        sm: {
            button: string;
        };
        md: {
            button: string;
        };
        lg: {
            button: string;
        };
        xl: {
            button: string;
        };
    };
    icon: {
        xs: {
            button: string;
            icon: string;
            leading: string;
            trailing: string;
        };
        sm: {
            button: string;
            icon: string;
            leading: string;
            trailing: string;
        };
        md: {
            button: string;
            icon: string;
            leading: string;
            trailing: string;
        };
        lg: {
            button: string;
            icon: string;
            leading: string;
            trailing: string;
        };
        xl: {
            button: string;
            icon: string;
            leading: string;
            trailing: string;
        };
    };
};
export declare type ButtonProps<Href extends string | undefined = undefined> = UnstyledButtonProps<Href> & {
    variant?: keyof (typeof styles)["variant"];
    color?: keyof (typeof styles)["color"] | "white";
    size?: keyof (typeof styles)["size"];
    icon?: boolean;
    leadingIcon?: ReactElement;
    leading?: ReactElement;
    trailingIcon?: ReactElement;
    trailing?: ReactElement;
    loading?: boolean;
    disabled?: boolean;
    rounded?: boolean;
};
declare const _default: import("react").ForwardRefExoticComponent<{
    href?: string | undefined;
    target?: string | undefined;
    rel?: string | undefined;
} & Omit<(Omit<import("react").AnchorHTMLAttributes<HTMLAnchorElement>, keyof {
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
} & import("react").RefAttributes<HTMLAnchorElement>) | import("react").DetailedHTMLProps<import("react").ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, "ref"> & {
    variant?: "text" | "light" | "filled" | "outlined" | "custom" | undefined;
    color?: "default" | "success" | "error" | "primary" | "gray" | "white" | undefined;
    size?: "xs" | "sm" | "lg" | "xl" | "md" | undefined;
    icon?: boolean | undefined;
    leadingIcon?: ReactElement<any, string | import("react").JSXElementConstructor<any>> | undefined;
    leading?: ReactElement<any, string | import("react").JSXElementConstructor<any>> | undefined;
    trailingIcon?: ReactElement<any, string | import("react").JSXElementConstructor<any>> | undefined;
    trailing?: ReactElement<any, string | import("react").JSXElementConstructor<any>> | undefined;
    loading?: boolean | undefined;
    disabled?: boolean | undefined;
    rounded?: boolean | undefined;
} & import("react").RefAttributes<HTMLAnchorElement | HTMLButtonElement>>;
export default _default;
