import { ReactNode } from "react";
export declare type TableHeaderProps = {
    title?: ReactNode;
    subtitle?: ReactNode;
    children?: ReactNode;
};
export default function TableHeader({ title, subtitle, children, }: TableHeaderProps): JSX.Element;
