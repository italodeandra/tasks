import { ReactNode } from "react";
import { ButtonProps } from "../Button/Button";
export declare type TableActionButtonProps<Href extends string | undefined> = {
    title?: ReactNode;
} & ButtonProps<Href>;
export default function TableActionButton<Href extends string | undefined>({ children, className, title, onClick, ...props }: TableActionButtonProps<Href>): JSX.Element;
