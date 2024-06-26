import React, { ReactNode, useCallback, useMemo, useState } from "react";
import {
  closestCenter,
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./item/SortableItem";
import { DragOverEvent } from "@dnd-kit/core/dist/types";
import { Item } from "./item/Item";
import { groupBy, isEqual, mapValues, toPairs } from "lodash";
import { useDeepCompareEffect } from "react-use";
import clsx from "@italodeandra/ui/utils/clsx";
import { Orientation } from "./Orientation";
import { isTouchDevice } from "@italodeandra/ui/utils/isBrowser";
import { columns } from "../../../consts";

const PLACEHOLDER_ID = "placeholder";

const dropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};

export function Kanban<
  T extends { _id: string; columnId: string; index: number }
>({
  value,
  onChangeValue,
  renderItem,
  orientation = Orientation.VERTICAL,
  renderColumn,
  disabledItems,
  hiddenColumns,
}: {
  value: T[];
  onChangeValue: (value: T[]) => void;
  renderItem: (item: T) => ReactNode;
  renderColumn: (column: string, taskCount: number) => ReactNode;
  orientation?: Orientation;
  disabledItems?: string[];
  hiddenColumns?: string[];
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [items, setItems] = useState<Record<string, string[]>>({});
  const mobileSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 500,
      tolerance: 4,
    },
  });
  const desktopSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 4,
    },
  });
  const sensors = useSensors(isTouchDevice ? mobileSensor : desktopSensor);

  useDeepCompareEffect(() => {
    const groupedItems = mapValues(groupBy(value, "columnId"), (items) =>
      items.map((i) => i._id)
    );
    const newItems: typeof items = {};
    for (const column of columns) {
      newItems[column] = groupedItems[column] || [];
    }
    setItems(newItems);
  }, [value]);

  useDeepCompareEffect(() => {
    const newValue = toPairs(items).flatMap(([columnId, items]) =>
      items.map((i, index) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const item = value.find((v) => v._id === i)!;
        return {
          ...item,
          index,
          columnId,
        };
      })
    );
    if (!activeId && !isEqual(newValue, value)) {
      onChangeValue?.(newValue);
    }
  }, [activeId, items]);

  const containers = useMemo(
    () => Object.keys(items) as UniqueIdentifier[],
    [items]
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;

    setActiveId(active.id.toString());
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const activeId = event.active?.id.toString();
      const overId = event.over?.id.toString();

      if (activeId && overId && activeId !== overId) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const overContainer = containers.find((container) =>
          items[container].includes(overId)
        )!;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const activeContainer = containers.find((container) =>
          items[container].includes(activeId)
        )!;

        if (overContainer === activeContainer) {
          setItems((items) => {
            const oldIndex = items[overContainer].indexOf(activeId);
            const newIndex = items[overContainer].indexOf(overId);

            return {
              ...items,
              [overContainer]: arrayMove(
                items[overContainer],
                oldIndex,
                newIndex
              ),
            };
          });
        }
      }

      setActiveId(null);
    },
    [containers, items]
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const activeId = event.active?.id.toString();
      const overId = event.over?.id.toString();

      if (activeId && overId && activeId !== overId) {
        const overContainer =
          containers.find((container) => items[container].includes(overId)) ||
          overId.replace(`${PLACEHOLDER_ID}-`, "");
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const activeContainer = containers.find((container) =>
          items[container].includes(activeId)
        )!;

        if (overContainer !== activeContainer) {
          setItems((items) => {
            // const oldIndex = items[activeContainer].indexOf(activeId);
            const newIndex = items[overContainer].indexOf(overId);

            return {
              ...items,
              [activeContainer]: items[activeContainer].filter(
                (id) => id !== activeId
              ),
              [overContainer]: [
                ...items[overContainer].slice(0, newIndex),
                activeId,
                ...items[overContainer].slice(newIndex),
              ],
            } as typeof items;
          });
        }
      }
    },
    [containers, items]
  );

  return (
    <div className="flex flex-col justify-center gap-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
      >
        <div
          className={clsx("flex gap-2 p-2 overflow-auto", {
            "flex-col": orientation === Orientation.VERTICAL,
          })}
        >
          {containers.map((container) => {
            const containerItems = items[container];
            const isHidden = hiddenColumns?.includes(container.toString());
            return (
              <div
                key={container}
                className={clsx("flex flex-col gap-0.5", {
                  "max-w-[300px] shrink-0":
                    orientation === Orientation.HORIZONTAL,
                  "w-full": orientation === Orientation.HORIZONTAL && !isHidden,
                })}
              >
                <div className="text-sm font-medium flex">
                  {renderColumn(container.toString(), containerItems.length)}
                </div>
                <SortableContext
                  items={containerItems}
                  strategy={verticalListSortingStrategy}
                >
                  {!isHidden &&
                    containerItems.map((id) => (
                      <SortableItem
                        key={id}
                        id={id}
                        value={value}
                        renderItem={renderItem}
                        disabled={disabledItems?.includes(id)}
                      />
                    ))}
                  {(isHidden || !containerItems.length) && (
                    <SortableItem
                      id={`${PLACEHOLDER_ID}-${container}`}
                      placeholder
                    />
                  )}
                </SortableContext>
              </div>
            );
          })}
        </div>
        <DragOverlay dropAnimation={dropAnimation}>
          {activeId ? (
            <Item
              id={activeId}
              value={value}
              renderItem={renderItem}
              dragOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
