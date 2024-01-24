import React, { ReactNode, useCallback, useMemo, useState } from "react";
import {
  closestCenter,
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
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
import { groupBy, mapValues, toPairs } from "lodash";
import { useDeepCompareEffect } from "react-use";
import clsx from "@italodeandra/ui/utils/clsx";

import { Orientation } from "./Orientation";

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
}: {
  value: T[];
  onChangeValue: (value: T[]) => void;
  renderItem: (item: T) => ReactNode;
  renderColumn: (column: string) => ReactNode;
  orientation?: Orientation;
}) {
  let [activeId, setActiveId] = useState<string | null>(null);
  let [items, setItems] = useState<Record<string, string[]>>({});
  let sensors = useSensors(
    // useSensor(PointerSensor, {
    //   activationConstraint: {
    //     distance: 4,
    //   },
    // }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 500,
        tolerance: 4,
      },
    })
    // useSensor(KeyboardSensor, {
    //   coordinateGetter: sortableKeyboardCoordinates,
    // })
  );

  useDeepCompareEffect(() => {
    let groupedItems = mapValues(groupBy(value, "columnId"), (items) =>
      items.map((i) => i._id)
    );
    setItems(groupedItems);
  }, [value]);

  useDeepCompareEffect(() => {
    if (!activeId) {
      let newValue = toPairs(items).flatMap(([columnId, items]) =>
        items.map((i, index) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          let item = value.find((v) => v._id === i)!;
          return {
            ...item,
            index,
            columnId,
          };
        })
      );
      onChangeValue?.(newValue);
    }
  }, [items]);

  let containers = useMemo(
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
        let overContainer = containers.find((container) =>
          items[container].includes(overId)
        )!;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        let activeContainer = containers.find((container) =>
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
        let overContainer =
          containers.find((container) => items[container].includes(overId)) ||
          overId.replace(`${PLACEHOLDER_ID}-`, "");
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        let activeContainer = containers.find((container) =>
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
          className={clsx("flex gap-2 p-2", {
            "flex-col": orientation === Orientation.VERTICAL,
          })}
        >
          {containers.map((container) => {
            let containerItems = items[container];
            return (
              <div
                key={container}
                className={clsx("flex flex-col gap-0.5", {
                  "max-w-[300px]": orientation === Orientation.HORIZONTAL,
                })}
              >
                <div className="text-sm font-medium">
                  {renderColumn(container.toString())}
                </div>
                <SortableContext
                  items={containerItems}
                  strategy={verticalListSortingStrategy}
                >
                  {containerItems.map((id) => (
                    <SortableItem
                      key={id}
                      id={id}
                      value={value}
                      renderItem={renderItem}
                    />
                  ))}
                  {!containerItems.length && (
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
