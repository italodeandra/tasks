import { forwardRef, } from "react";
import clsx from "../../utils/clsx";
import NextLink from "next/link";
export const defaultTextStyles = {
    variant: {
        default: "text-zinc-700 dark:text-zinc-200",
        label: "text-zinc-800 font-medium dark:text-zinc-100",
        secondary: "text-sm text-zinc-500 dark:text-zinc-400",
        link: "font-medium text-primary-500 hover:decoration-primary-500 underline decoration-2 decoration-primary-500/40 transition-colors",
    },
    size: {
        xs: "text-xs",
        sm: "text-sm",
        base: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
    },
};
function Text({ inline, variant = "default", className, href, target, size = variant !== "label" ? "base" : "sm", ...props }, ref) {
    className = clsx(defaultTextStyles.variant[variant], defaultTextStyles.size[size], className);
    if (href) {
        return (<NextLink ref={ref} href={href} target={target} {...props} className={className}/>);
    }
    if (inline) {
        return <span ref={ref} {...props} className={className}/>;
    }
    return (<div ref={ref} {...props} className={className}/>);
}
export default forwardRef(Text);
