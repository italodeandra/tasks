import { ForwardedRef, ReactNode } from "react";
declare function Tooltip({ children, content, side, }: {
    children?: ReactNode;
    content?: ReactNode;
    side?: "top" | "bottom" | "left" | "right";
}, ref: ForwardedRef<HTMLButtonElement>): JSX.Element;
declare const _default: typeof Tooltip;
export default _default;
