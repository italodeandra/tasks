import { ReactNode } from "react";
export default function NavigationDrawer({ children, navigationChildren, position, title, noPadding, }: {
    children: ReactNode;
    navigationChildren: ReactNode;
    position?: "left" | "right";
    title?: ReactNode;
    noPadding?: boolean;
}): JSX.Element;
