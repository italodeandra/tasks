import React, { ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { UniqueIdentifier } from "@dnd-kit/core";
import clsx from "clsx";

export default function SortableItem({
  id,
  className,
  renderItem,
}: {
  id: UniqueIdentifier;
  className?: string;
  renderItem?: (id: UniqueIdentifier) => ReactNode;
}) {
  const { attributes, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  let rendered = renderItem ? renderItem(id) : id;

  return (
    <div
      ref={setNodeRef}
      className={clsx(className, {
        "-my-1": !rendered,
      })}
      style={style}
      {...attributes}
    >
      {rendered}
    </div>
  );
}
