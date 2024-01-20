import { DetailedHTMLProps, HTMLAttributes } from "react";
import { ComponentProps } from "react";
import NextLink from "next/link";
export declare const defaultTextStyles: {
    variant: {
        default: string;
        label: string;
        secondary: string;
        link: string;
    };
    size: {
        xs: string;
        sm: string;
        base: string;
        lg: string;
        xl: string;
        "2xl": string;
    };
};
export type TextProps<Inline extends boolean | undefined, Href extends string | undefined> = {
    variant?: keyof (typeof defaultTextStyles)["variant"];
    size?: keyof (typeof defaultTextStyles)["size"];
    inline?: Inline;
    href?: Href;
    target?: string;
    rel?: string;
} & (Href extends true ? ComponentProps<typeof NextLink> : Inline extends true ? DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> : DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>);
declare const _default: import("react").ForwardRefExoticComponent<(Pick<{
    variant?: "default" | "label" | "secondary" | "link" | undefined;
    size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | undefined;
    inline?: boolean | undefined;
    href?: string | undefined;
    target?: string | undefined;
    rel?: string | undefined;
} & import("react").ClassAttributes<HTMLSpanElement> & HTMLAttributes<HTMLSpanElement>, "size" | "variant" | "href" | "rel" | "target" | "inline" | "key" | keyof HTMLAttributes<HTMLSpanElement>> | Pick<{
    variant?: "default" | "label" | "secondary" | "link" | undefined;
    size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | undefined;
    inline?: boolean | undefined;
    href?: string | undefined;
    target?: string | undefined;
    rel?: string | undefined;
} & import("react").ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement>, "size" | "variant" | "href" | "rel" | "target" | "inline" | "key" | keyof HTMLAttributes<HTMLDivElement>>) & import("react").RefAttributes<HTMLDivElement>>;
export default _default;
