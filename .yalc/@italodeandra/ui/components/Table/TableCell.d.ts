import { ReactNode } from "react";
export declare type TableCellProps = {
    children?: ReactNode;
    className?: string;
    actions?: boolean;
    colSpan?: number;
};
export default function TableCell({ children, className, actions, colSpan, }: TableCellProps): JSX.Element;
