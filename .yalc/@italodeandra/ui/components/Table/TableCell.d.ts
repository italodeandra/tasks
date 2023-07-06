import { ReactNode } from "react";
export declare type TableCellProps = {
    children?: ReactNode;
    className?: string;
    actions?: boolean;
    colSpan?: number;
    title?: string;
};
export default function TableCell({ children, className, actions, colSpan, title, }: TableCellProps): JSX.Element;
