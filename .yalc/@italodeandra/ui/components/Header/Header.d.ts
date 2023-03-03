import { DetailedHTMLProps, HTMLAttributes } from "react";
export declare type HeaderProps = {
    hideOnScroll?: boolean;
} & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
export default function Header({ className, hideOnScroll, ...props }: HeaderProps): JSX.Element;
