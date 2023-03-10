import { HTMLAttributes } from "react";
import clsx from "clsx";

export function AlertButton({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={clsx(
        "rounded border px-1 py-0.5 text-sm font-semibold transition-colors",
        "border-transparent text-red-11", // default
        "hover:bg-red-6", // hover
        "focus:border-red-8 focus:outline-none", // focus
        "active:border-red-7", // active
        className
      )}
    >
      {children}
    </button>
  );
}
