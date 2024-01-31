import { ReactNode } from "react";
export type DialogProps = {
    open?: boolean;
    onClose?: (open: boolean) => void;
    title?: ReactNode;
    children: ReactNode;
    position?: "left" | "right";
    actions?: ReactNode;
    hideOverlay?: boolean;
    className?: string;
    noPadding?: boolean;
    panelClassName?: string;
};
export default function Drawer({ open: defaultOpen, onClose, title, children, position, actions, hideOverlay, className, noPadding, panelClassName, }: DialogProps): JSX.Element;
