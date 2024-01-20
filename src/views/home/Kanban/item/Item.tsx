import React, {
  ForwardedRef,
  forwardRef,
  HTMLProps,
  ReactNode,
  useEffect,
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
    if (!dragOverlay) {
      return;
    }

    document.body.style.cursor = "grabbing";

    return () => {
      document.body.style.cursor = "";
    };
  }, [dragOverlay]);

  if (placeholder) {
    return <div ref={ref} className="-mt-2" />;
  }

  return (
    <div
      {...props}
      ref={ref}
      className={clsx("flex gap-2 rounded bg-zinc-900", className)}
    >
      {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
      {value && renderItem && renderItem(value.find((i) => i._id === id)!)}
    </div>
  );
}

export const Item = forwardRef(ItemWithRef) as typeof ItemWithRef;
