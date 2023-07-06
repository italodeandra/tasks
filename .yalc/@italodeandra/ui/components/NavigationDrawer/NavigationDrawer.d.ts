import { ReactNode } from "react";
export default function NavigationDrawer({ children, navigationChildren, position, title, }: {
    children: ReactNode;
    navigationChildren: ReactNode;
    position?: "left" | "right";
    title?: ReactNode;
}): JSX.Element;
