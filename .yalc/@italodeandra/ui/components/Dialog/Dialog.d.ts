import { ReactNode } from "react";
export default function Dialog({ children, title, description, open, onOpenChange, }: {
    children: ReactNode;
    title?: ReactNode;
    description?: ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}): JSX.Element;
