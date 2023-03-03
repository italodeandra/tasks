import type { DetailedHTMLProps, HTMLAttributes } from "react";
import { ComponentProps } from "react";
import NextLink from "next/link";
export declare const defaultTextStyles: {
    variant: {
        default: string;
        label: string;
        secondary: string;
        link: string;
    };
};
export declare type TextProps<Inline extends boolean | undefined, Href extends string | undefined> = {
    variant?: keyof typeof defaultTextStyles["variant"];
    inline?: Inline;
    href?: Href;
    target?: string;
} & (Href extends true ? ComponentProps<typeof NextLink> : Inline extends true ? DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> : DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>);
export default function Text<Inline extends boolean | undefined, Href extends string | undefined>({ inline, variant, className, href, target, ...props }: TextProps<Inline, Href>): JSX.Element;
