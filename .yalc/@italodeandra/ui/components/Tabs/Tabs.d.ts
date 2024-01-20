import { ReactNode } from "react";
export default function Tabs({ children, className, }: {
    children: ReactNode;
    className?: string;
}): JSX.Element;
export declare function Tab({ children, selected, onClick, }: {
    children: ReactNode;
    selected?: boolean;
    onClick?: () => void;
}): JSX.Element;
