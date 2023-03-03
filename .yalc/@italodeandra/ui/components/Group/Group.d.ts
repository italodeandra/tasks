import type { DetailedHTMLProps, HTMLAttributes } from "react";
export declare type GroupProps = {
    wrap?: boolean;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
export default function Group({ wrap, className, ...props }: GroupProps): JSX.Element;
