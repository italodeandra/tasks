import { ReactNode } from "react";
export default function Dialog({ children, title, description, open, onOpenChange, contentClassName, contentOverflowClassName, }: {
    children: ReactNode;
    title?: ReactNode;
    description?: ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    contentClassName?: string;
    contentOverflowClassName?: string;
}): JSX.Element;
