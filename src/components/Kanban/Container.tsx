import React, { ReactNode } from "react";
import { UniqueIdentifier, useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortableItem from "./SortableItem";
import clsx from "clsx";

export default function Container({
  id,
  items,
  renderItem,
  className,
}: {
  id: string;
  items: UniqueIdentifier[];
  renderItem?: (id: UniqueIdentifier) => ReactNode;
  className?: string;
}) {
  let { setNodeRef, active } = useDroppable({
    id,
  });

  return (
    <SortableContext
      id={id}
      items={items}
      strategy={verticalListSortingStrategy}
    >
      <div ref={setNodeRef} className={className}>
        {items.map((id) => (
          <SortableItem
            key={id}
            id={id}
            className={clsx({
              "opacity-50": active?.id === id,
            })}
            renderItem={renderItem}
          />
        ))}
      </div>
    </SortableContext>
  );
}
