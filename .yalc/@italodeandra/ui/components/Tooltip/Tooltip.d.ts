import { ReactNode } from "react";
export default function Tooltip({ children, content, side, }: {
    children?: ReactNode;
    content?: string;
    side?: "top" | "bottom" | "left" | "right";
}): JSX.Element;
