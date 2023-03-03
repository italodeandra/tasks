import { ReactNode } from "react";
declare const colorMap: {
    primary: {
        badge: string;
        button: string;
    };
};
declare const sizeMap: {
    badge: {
        sm: string;
        md: string;
        lg: string;
    };
    button: {
        sm: string;
        md: string;
        lg: string;
    };
};
export default function Badge({ color, size, className, children, onActionClick, href, shallow, }: {
    color?: keyof typeof colorMap;
    size?: keyof typeof sizeMap["badge"];
    className?: string;
    children: ReactNode;
    onActionClick?: () => void;
    href?: string;
    shallow?: boolean;
}): JSX.Element;
export {};
