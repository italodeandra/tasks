import React, {
  ForwardedRef,
  forwardRef,
  HTMLProps,
  ReactNode,
  useEffect,
  useMemo,
} from "react";
import clsx from "@italodeandra/ui/utils/clsx";

export function ItemWithRef<T extends { _id: string }>(
  {
    id,
    dragOverlay,
    className,
    placeholder,
    value,
    renderItem,
    ...props
  }: Omit<HTMLProps<HTMLDivElement>, "id" | "placeholder" | "value"> & {
    id: string | number;
    dragOverlay?: boolean;
    placeholder?: boolean;
    value?: T[];
    renderItem?: (item: T) => ReactNode;
  },
  ref: ForwardedRef<HTMLDivElement>
) {
  useEffect(() => {
    if (!dragOverlay || placeholder) {
      return;
    }

    document.body.style.cursor = "grabbing";

    return () => {
      document.body.style.cursor = "";
    };
  }, [dragOverlay, placeholder]);

  let itemElement = useMemo(
    () =>
      !placeholder &&
      value &&
      renderItem &&
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      renderItem(value.find((i) => i._id === id)!),
    [id, placeholder, renderItem, value]
  );

  if (placeholder) {
    return <div ref={ref} className="-mt-2" />;
  }

  return (
    <div
      {...props}
      ref={ref}
      className={clsx("touch-manipulation transition-all", className, {
        "scale-[1.01] sm:scale-100": dragOverlay,
      })}
    >
      {itemElement}
    </div>
  );
}

export const Item = forwardRef(ItemWithRef) as typeof ItemWithRef;
