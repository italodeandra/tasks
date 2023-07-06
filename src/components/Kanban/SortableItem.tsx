import React, { ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { UniqueIdentifier } from "@dnd-kit/core";

export default function SortableItem({
  id,
  className,
  renderItem,
}: {
  id: UniqueIdentifier;
  className?: string;
  renderItem?: (id: UniqueIdentifier) => ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      className={className}
      style={style}
      {...attributes}
      {...listeners}
    >
      {renderItem ? renderItem(id) : id}
    </div>
  );
}
