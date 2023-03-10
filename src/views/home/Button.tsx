import {
  cloneElement,
  ForwardedRef,
  forwardRef,
  HTMLAttributes,
  isValidElement,
  ReactElement,
} from "react";
import clsx from "clsx";

export const Button = forwardRef(function Button(
  {
    children,
    className,
    color = "gray",
    variant = "outline",
    ...props
  }: HTMLAttributes<HTMLButtonElement> & {
    color?: "gray";
    variant?: "outline" | "text";
  },
  forwaredRef: ForwardedRef<HTMLButtonElement>
) {
  return (
    <button
      {...props}
      className={clsx(
        "flex items-center justify-center gap-2 rounded border font-medium leading-none transition-colors focus:outline-none",
        "px-1 py-1 text-sm", // size
        ...{
          gray: {
            outline: [
              "border-gray-5", // default
              "hover:bg-gray-3", // hover
              "focus:border-gray-8", // focus
              "active:border-gray-7", // active
            ],
            text: [
              "border-transparent", // default
              "hover:bg-gray-3", // hover
              "focus:border-gray-8", // focus
              "active:border-gray-7", // active
            ],
          },
        }[color][variant],
        className
      )}
      ref={forwaredRef}
    >
      {children &&
      isValidElement(children) &&
      (children?.type as any)?.render.name.endsWith("Icon")
        ? cloneElement(children as ReactElement, {
            className: clsx("h-4 w-4", (children as any).props?.className),
          })
        : children}
    </button>
  );
});
