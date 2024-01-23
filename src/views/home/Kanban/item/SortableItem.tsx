import React, { ReactNode, useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "@italodeandra/ui/utils/clsx";
import { Item } from "./Item";

export function SortableItem<T extends { _id: string }>({
  id,
  placeholder,
  value,
  renderItem,
}: {
  id: string;
  placeholder?: boolean;
  value?: T[];
  renderItem?: (item: T, dragOverlay: boolean) => ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, active } =
    useSortable({ id });

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
    }),
    [transform, transition]
  );

  return (
    <Item
      id={id}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={clsx({
        "opacity-50": active?.id === id,
      })}
      placeholder={placeholder}
      value={value}
      renderItem={renderItem}
      isDragging={!!active}
    />
  );
}
