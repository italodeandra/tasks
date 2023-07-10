/// <reference types="node" />
import type { ButtonHTMLAttributes, ComponentProps, DetailedHTMLProps } from "react";
import NextLink from "next/link";
export declare type UnstyledButtonProps<Href extends string | undefined> = {
    href?: Href;
    target?: string;
} & Omit<Href extends string ? ComponentProps<typeof NextLink> : DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, "ref">;
declare const _default: import("react").ForwardRefExoticComponent<{
    href?: string | undefined;
    target?: string | undefined;
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
} & import("react").RefAttributes<HTMLAnchorElement>) | DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, "ref"> & import("react").RefAttributes<HTMLAnchorElement | HTMLButtonElement>>;
export default _default;
