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
    isDragging,
    ...props
  }: Omit<HTMLProps<HTMLDivElement>, "id" | "placeholder" | "value"> & {
    id: string | number;
    dragOverlay?: boolean;
    placeholder?: boolean;
    value?: T[];
    renderItem?: (item: T, drag: boolean) => ReactNode;
    isDragging?: boolean;
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
    <div {...props} ref={ref} className={clsx(className)}>
      {value &&
        renderItem &&
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        renderItem(
          value.find((i) => i._id === id)!,
          !!dragOverlay || !!isDragging
        )}
    </div>
  );
}

export const Item = forwardRef(ItemWithRef) as typeof ItemWithRef;
