import { ReactNode } from "react";
export interface DialogProps {
    title: ReactNode;
    description?: ReactNode;
    contentClassName?: string;
    contentOverflowClassName?: string;
    closeButtonClassName?: string;
    overlayClassName?: string;
    titleClassName?: string;
    descriptionClassName?: string;
    hideTitle?: boolean;
}
export default function Dialog({ children, title, description, open, onOpenChange, contentClassName, contentOverflowClassName, closeButtonClassName, overlayClassName, titleClassName, descriptionClassName, hideTitle, }: {
    children: ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
} & DialogProps): import("react").JSX.Element;
