import { MouseEventHandler, ReactNode } from "react";
export declare type TableRowProps = {
    children?: ReactNode;
    onClick?: MouseEventHandler<HTMLTableRowElement>;
};
export default function TableRow({ children, onClick }: TableRowProps): JSX.Element;
