import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor as LibMouseSensor,
  KeyboardSensor as LibKeyboardSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import React, {
  ReactElement,
  ReactNode,
  useEffect,
  useState,
  MouseEvent,
  KeyboardEvent,
} from "react";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { isEqual, map } from "lodash";
import { DragOverEvent } from "@dnd-kit/core/dist/types";
import clsx from "clsx";
import Container from "./Container";

export class MouseSensor extends LibMouseSensor {
  static activators = [
    {
      eventName: "onMouseDown" as const,
      handler: ({ nativeEvent: event }: MouseEvent) => {
        return shouldHandleEvent(event.target as HTMLElement);
      },
    },
  ];
}

export class KeyboardSensor extends LibKeyboardSensor {
  static activators = [
    {
      eventName: "onKeyDown" as const,
      handler: ({ nativeEvent: event }: KeyboardEvent) => {
        return shouldHandleEvent(event.target as HTMLElement);
      },
    },
  ];
}

function shouldHandleEvent(element: HTMLElement | null) {
  let cur = element;

  while (cur) {
    if (cur.dataset && cur.dataset.noDnd) {
      return false;
    }
    cur = cur.parentElement;
  }

  return true;
}

const defaultRenderColumn = (id: UniqueIdentifier, children: ReactNode) =>
  children;

export function Kanban({
  items: defaultItems,
  renderItem,
  onChange,
  renderColumn = defaultRenderColumn,
  className,
  containerClassName,
}: {
  items: Record<string, UniqueIdentifier[]>;
  renderItem?: (id: UniqueIdentifier) => ReactNode;
  renderColumn?: (
    id: UniqueIdentifier,
    children: ReactElement | null
  ) => ReactNode;
  onChange?: (items: Record<string, UniqueIdentifier[]>) => void;
  className?: string;
  containerClassName?: string;
}) {
  let [items, setItems] =
    useState<Record<string, UniqueIdentifier[]>>(defaultItems);
  let [activeId, setActiveId] = useState<UniqueIdentifier | null>();

  let sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    onChange?.(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);
  useEffect(() => {
    if (!isEqual(defaultItems, items)) {
      setItems(defaultItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultItems]);

  let findContainer = (id: UniqueIdentifier) => {
    if (id in items) {
      return id;
    }

    return Object.keys(items).find((key) =>
      items[key as keyof typeof items].includes(id)
    );
  };

  let handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  let handleDragOver = ({ active, over, delta }: DragOverEvent) => {
    let { id } = active;
    if (!over) {
      return;
    }
    let { id: overId } = over;

    // Find the containers
    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setItems((prev) => {
      let activeItems = prev[activeContainer];
      let overItems = prev[overContainer];

      // Find the indexes for the items
      let activeIndex = activeItems.indexOf(id);
      let overIndex = overItems.indexOf(overId);

      let newIndex;
      if (overId in prev) {
        // We're at the root droppable of a container
        newIndex = overItems.length + 1;
      } else {
        let isBelowLastItem =
          over &&
          overIndex === overItems.length - 1 &&
          delta.y > over.rect.top + over.rect.height;

        let modifier = isBelowLastItem ? 1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer].filter((item) => item !== active.id),
        ],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          items[activeContainer][activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length),
        ],
      };
    });
  };

  let handleDragEnd = ({ active, over }: DragEndEvent) => {
    let { id } = active;
    if (!over) {
      return;
    }
    let { id: overId } = over;

    let activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    const activeIndex = items[activeContainer].indexOf(active.id);
    const overIndex = items[overContainer].indexOf(overId);

    if (activeIndex !== overIndex) {
      setItems((items) => ({
        ...items,
        [overContainer]: arrayMove(
          items[overContainer],
          activeIndex,
          overIndex
        ),
      }));
    }

    setActiveId(null);
  };

  return (
    <div className={clsx("flex", className)}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {map(items, (tasks, id) =>
          renderColumn(
            id,
            tasks.length ? (
              <Container
                className={containerClassName}
                key={id}
                id={id}
                items={tasks}
                renderItem={renderItem}
              />
            ) : null
          )
        )}
        <DragOverlay>
          {activeId ? (renderItem ? renderItem(activeId) : activeId) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
