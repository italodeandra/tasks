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
  renderItem?: (item: T) => ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

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
        "opacity-50": isDragging,
      })}
      placeholder={placeholder}
      value={value}
      renderItem={renderItem}
    />
  );
}
