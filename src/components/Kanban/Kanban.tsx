import { ComponentType, useCallback, useEffect, useRef, useState } from "react";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { cloneDeep, find, findIndex, isEqual, remove } from "lodash-es";
import Button from "@italodeandra/ui/components/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useLatest } from "react-use";
import { move } from "./move";
import { ICard } from "./ICard";
import { IList } from "./IList";
import { Card } from "./Card";
import { List } from "./List";
import { isTouchDevice } from "@italodeandra/ui/utils/isBrowser";
import clsx from "@italodeandra/ui/utils/clsx";
import { produce } from "immer";
import { showNotification } from "@italodeandra/ui/components/Notifications/notifications.state";

function removeDragElements() {
  const elementsToRemove = document.querySelectorAll("[data-drag-element]");
  for (const elementToRemove of Array.from(elementsToRemove)) {
    elementToRemove.parentElement?.removeChild(elementToRemove);
  }
}

function getMousePos(
  event: MouseEvent | TouchEvent,
): Pick<MouseEvent | Touch, "clientX" | "clientY"> {
  const eventWithPos = (event as TouchEvent).touches?.[0]
    ? (event as TouchEvent).touches[0]
    : (event as TouchEvent).changedTouches?.[0]
      ? (event as TouchEvent).changedTouches[0]
      : (event as MouseEvent);
  return {
    clientX: eventWithPos.clientX,
    clientY: eventWithPos.clientY,
  };
}

function getMousePosTarget(
  mousePos: Pick<MouseEvent | Touch, "clientX" | "clientY">,
) {
  return document.elementFromPoint(mousePos.clientX, mousePos.clientY) as
    | HTMLDivElement
    | undefined;
}

export function Kanban({
  orientation = "horizontal",
  onClickCard,
  data: dataProp,
  cardName = "card",
  listName = "list",
  onChange,
  cardAdditionalContent,
  cardAdditionalActions,
  className,
  uploadClipboardImage,
  canAddList,
  canMoveList,
  canEditList,
}: {
  orientation?: "horizontal" | "vertical";
  onClickCard?: (selected: { cardId: string; listId: string }) => void;
  data: IList[];
  cardName?: string;
  listName?: string;
  onChange?: (data: IList[]) => void;
  cardAdditionalContent?: ComponentType<{ cardId: string; listId: string }>;
  cardAdditionalActions?: ComponentType<{ cardId: string; listId: string }>;
  className?: string;
  uploadClipboardImage?: (image: string) => Promise<string>;
  canAddList?: boolean;
  canMoveList?: boolean;
  canEditList?: boolean;
}) {
  const [data, setData] = useState<IList[]>(dataProp);
  const dataRef = useLatest(data);
  const kanbanRef = useRef<HTMLDivElement>(null);
  const cardClickTimeout = useRef(0);

  useEffect(() => {
    if (onChange && !isEqual(data, dataProp)) {
      onChange(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (!isEqual(data, dataProp)) {
      setData(dataProp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataProp]);

  const [draggingCard, setDraggingCard] = useState<{
    card: ICard;
    list: IList;
    originalElement: HTMLDivElement;
    dragElement?: HTMLDivElement;
    startMousePos: {
      x: number;
      y: number;
    };
    unstick?: boolean;
  } | null>(null);
  const draggingCardRef = useLatest(draggingCard);

  const [draggingList, setDraggingList] = useState<{
    list: IList;
    originalElement: HTMLDivElement;
    dragElement?: HTMLDivElement;
    startMousePos: {
      x: number;
      y: number;
    };
    unstick?: boolean;
  } | null>(null);
  const draggingListRef = useLatest(draggingList);

  const getMousePosTargetCardIdAndListId = useCallback(
    (event: MouseEvent | TouchEvent) => {
      const mousePos = getMousePos(event);
      if (isTouchDevice) {
        kanbanRef.current!.classList.remove("pointer-events-none");
      }
      const target = getMousePosTarget(mousePos);
      if (isTouchDevice) {
        kanbanRef.current!.classList.add("pointer-events-none");
      }
      const cardId = target
        ?.closest("[data-card-id]")
        ?.getAttribute("data-card-id");
      const listId = target
        ?.closest("[data-list-id]")
        ?.getAttribute("data-list-id");
      return {
        cardId,
        listId,
        mousePos,
        target,
      };
    },
    [],
  );

  useEffect(() => {
    if (isTouchDevice) {
      kanbanRef.current!.classList.add("pointer-events-none");
    }

    const handleKanbanMouseUp = (event: MouseEvent | TouchEvent) => {
      removeDragElements();

      if (draggingCardRef.current) {
        const mousePos = getMousePos(event);
        const target = getMousePosTarget(mousePos);
        const newListButton = target?.closest("[data-new-list-button]");
        if (newListButton) {
          const lists = produce(dataRef.current, (draft) => {
            const previousList = find(draft, {
              _id: draggingCardRef.current!.list._id,
            });
            if (previousList?.cards) {
              remove(previousList.cards, {
                _id: draggingCardRef.current!.card._id,
              });
              draft.push({
                _id: isomorphicObjectId().toString(),
                title: `New ${listName}`,
                cards: [draggingCardRef.current!.card],
              });
            }
          });
          setData(lists);
        }

        draggingCardRef.current.originalElement.classList.remove("opacity-50");
        setDraggingCard(null);
      }
      if (draggingListRef.current) {
        draggingListRef.current.originalElement?.classList.remove("opacity-50");
        setDraggingList(null);
      }
      document.body.classList.remove("select-none");
    };

    const handleKanbanMouseMove = (event: MouseEvent | TouchEvent) => {
      const { cardId, listId, target, mousePos } =
        getMousePosTargetCardIdAndListId(event);

      // moving card
      if (draggingCardRef.current) {
        if (draggingCardRef.current.card._id !== cardId) {
          if (draggingCardRef.current.list._id === listId) {
            if (target && cardId) {
              const lists = produce(dataRef.current, (draft) => {
                const listToUpdate = find(draft, { _id: listId });
                if (listToUpdate?.cards) {
                  const previousIndex = findIndex(listToUpdate.cards, {
                    _id: draggingCardRef.current!.card._id,
                  });
                  const nextIndex = findIndex(listToUpdate.cards, {
                    _id: cardId,
                  });
                  const hoveredElementRect = target.getBoundingClientRect();
                  const movingElementRect =
                    draggingCardRef.current!.dragElement?.getBoundingClientRect();
                  if (
                    movingElementRect &&
                    ((nextIndex > previousIndex &&
                      mousePos.clientY >
                        hoveredElementRect.top +
                          hoveredElementRect.height -
                          movingElementRect.height) ||
                      (nextIndex < previousIndex &&
                        mousePos.clientY <
                          hoveredElementRect.top + movingElementRect.height))
                  ) {
                    move(listToUpdate.cards, previousIndex, nextIndex);
                  }
                }
              });
              setData(lists);
            }
          } else {
            if (listId) {
              const lists = produce(dataRef.current, (draft) => {
                const previousList = find(draft, {
                  _id: draggingCardRef.current!.list._id,
                });
                const nextList = find(draft, { _id: listId });
                if (previousList?.cards && nextList) {
                  nextList.cards = nextList.cards || [];
                  if (
                    !nextList.cards.some(
                      (c) => c._id === draggingCardRef.current!.card._id,
                    )
                  ) {
                    remove(previousList.cards, {
                      _id: draggingCardRef.current!.card._id,
                    });
                    const nextIndex = cardId
                      ? findIndex(nextList.cards, {
                          _id: cardId,
                        })
                      : nextList.cards.length;
                    nextList.cards.splice(
                      nextIndex,
                      0,
                      draggingCardRef.current!.card,
                    );
                  }
                }
              });
              const nextList = find(lists, { _id: listId });
              if (nextList) {
                setDraggingCard({
                  ...draggingCardRef.current!,
                  list: nextList,
                });
              }
              setData(lists);
            }
          }
        }
      }

      // moving list
      if (target && draggingListRef.current && listId) {
        if (draggingListRef.current.list._id !== listId) {
          const newData = produce(dataRef.current, (draft) => {
            const previousIndex = findIndex(draft, {
              _id: draggingListRef.current!.list._id,
            });
            const nextIndex = findIndex(draft, {
              _id: listId,
            });
            const hoveredElementRect = target.getBoundingClientRect();
            const movingElementRect =
              draggingListRef.current!.dragElement?.getBoundingClientRect();
            if (
              movingElementRect &&
              ((nextIndex > previousIndex &&
                mousePos.clientX >
                  hoveredElementRect.left +
                    hoveredElementRect.width -
                    movingElementRect.width) ||
                (nextIndex < previousIndex &&
                  mousePos.clientX <
                    hoveredElementRect.left + movingElementRect.width))
            ) {
              move(draft, previousIndex, nextIndex);
            }
          });
          setData(newData);
        }
      }

      // dragging card element
      if (draggingCardRef.current) {
        const { startMousePos, originalElement } = draggingCardRef.current;
        if (
          Math.abs(
            mousePos.clientX -
              startMousePos.x +
              (mousePos.clientY - startMousePos.y),
          ) > 10
        ) {
          clearTimeout(cardClickTimeout.current);
          draggingCardRef.current.unstick = true;
        }
        if (draggingCardRef.current.unstick) {
          (document.activeElement as HTMLElement | undefined)?.blur();
          document.body.classList.add("select-none");
          let dragElement = draggingCardRef.current.dragElement;
          if (!dragElement) {
            const originalElementRect = originalElement.getBoundingClientRect();
            dragElement = originalElement.cloneNode(true) as HTMLDivElement;
            dragElement.setAttribute("data-drag-element", "");
            dragElement.style.left = `${originalElementRect.left}px`;
            dragElement.style.top = `${originalElementRect.top}px`;
            dragElement.style.width = `${originalElementRect.width}px`;
            dragElement.style.height = `${originalElementRect.height}px`;
            dragElement.classList.add(
              "fixed",
              orientation === "horizontal" ? "rotate-6" : "rotate-1",
              "translate-x-[--x]",
              "translate-y-[--y]",
              "pointer-events-none",
              "z-10",
              "opacity-90",
            );
            removeDragElements();
            originalElement.parentElement!.prepend(dragElement);
            setDraggingCard({
              ...draggingCardRef.current,
              dragElement,
            });
          }

          dragElement.style.setProperty(
            "--x",
            `${mousePos.clientX - startMousePos.x}px`,
          );
          dragElement.style.setProperty(
            "--y",
            `${mousePos.clientY - startMousePos.y}px`,
          );
        }
      }

      // dragging list element
      if (draggingListRef.current) {
        const { startMousePos, originalElement } = draggingListRef.current;
        if (
          Math.abs(
            mousePos.clientX -
              startMousePos.x +
              (mousePos.clientY - startMousePos.y),
          ) > 10
        ) {
          draggingListRef.current.unstick = true;
        }
        if (draggingListRef.current.unstick) {
          (document.activeElement as HTMLElement | undefined)?.blur();
          document.body.classList.add("select-none");
          let dragElement = draggingListRef.current.dragElement;
          if (!dragElement) {
            const originalElementRect = originalElement.getBoundingClientRect();
            dragElement = originalElement.cloneNode(true) as HTMLDivElement;
            draggingListRef.current.dragElement = dragElement;
            dragElement.setAttribute("data-drag-element", "");
            dragElement.style.left = `${originalElementRect.left}px`;
            dragElement.style.top = `${originalElementRect.top}px`;
            dragElement.style.width = `${originalElementRect.width}px`;
            dragElement.style.height = `${originalElementRect.height}px`;
            dragElement.classList.add(
              "fixed",
              orientation === "horizontal" ? "rotate-6" : "rotate-1",
              "translate-x-[--x]",
              "translate-y-[--y]",
              "pointer-events-none",
              "z-10",
              "opacity-90",
            );
            removeDragElements();
            originalElement.parentElement!.prepend(dragElement);
            setDraggingList({
              ...draggingListRef.current,
              dragElement,
            });
          }

          dragElement.style.setProperty(
            "--x",
            `${mousePos.clientX - startMousePos.x}px`,
          );
          dragElement.style.setProperty(
            "--y",
            `${mousePos.clientY - startMousePos.y}px`,
          );
        }
      }
    };

    const handleCardMouseDown = (event: MouseEvent | TouchEvent) => {
      const { cardId, listId, mousePos, target } =
        getMousePosTargetCardIdAndListId(event);
      if (target && isTouchDevice) {
        if (!draggingCardRef.current?.unstick) {
          if (document.activeElement === target && onClickCard) {
            clearTimeout(cardClickTimeout.current);
            cardClickTimeout.current = window.setTimeout(() => {
              onClickCard({ cardId: cardId!, listId: listId! });
            }, 300);
          }
          if (
            cardId &&
            !target.getAttribute("class")?.includes("pointer-events-auto")
          ) {
            target.focus();
          }
        }
      }
      if (target && target.getAttribute("data-is-editing") !== "true")
        if (canMoveList && !cardId) {
          if (listId) {
            const list = find(dataRef.current, { _id: listId });
            if (list) {
              if (
                !target.getAttribute("class")?.includes("pointer-events-auto")
              ) {
                event.preventDefault();
                setDraggingList({
                  list,
                  startMousePos: {
                    x: mousePos.clientX,
                    y: mousePos.clientY,
                  },
                  originalElement: target.closest("[data-list-id]")!,
                });
              }
            }
          }
        } else {
          if (listId && cardId) {
            const list = find(dataRef.current, { _id: listId });
            if (list) {
              const card = find(list.cards, { _id: cardId });
              if (card) {
                if (
                  !target.getAttribute("class")?.includes("pointer-events-auto")
                ) {
                  event.preventDefault();
                  setDraggingCard({
                    card,
                    list,
                    startMousePos: {
                      x: mousePos.clientX,
                      y: mousePos.clientY,
                    },
                    originalElement: target,
                  });
                }
              }
            }
          }
        }
    };

    document.addEventListener("mouseup", handleKanbanMouseUp);
    document.addEventListener("touchend", handleKanbanMouseUp);
    document.addEventListener("mouseleave", handleKanbanMouseUp);
    document.addEventListener("touchcancel", handleKanbanMouseUp);
    document.addEventListener("mousemove", handleKanbanMouseMove);
    document.addEventListener("touchmove", handleKanbanMouseMove);
    document.addEventListener("mousedown", handleCardMouseDown);
    document.addEventListener("touchstart", handleCardMouseDown, {
      passive: false,
    });

    return () => {
      document.removeEventListener("mouseup", handleKanbanMouseUp);
      document.removeEventListener("touchend", handleKanbanMouseUp);
      document.removeEventListener("mouseleave", handleKanbanMouseUp);
      document.removeEventListener("touchcancel", handleKanbanMouseUp);
      document.removeEventListener("mousemove", handleKanbanMouseMove);
      document.removeEventListener("touchmove", handleKanbanMouseMove);
      document.removeEventListener("mousedown", handleCardMouseDown);
      document.removeEventListener("touchstart", handleCardMouseDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddNewCardClick = useCallback(
    (list: IList) => () => {
      const _id = isomorphicObjectId().toString();
      const lists = produce(dataRef.current, (draft) => {
        const listToUpdate = find(draft, { _id: list._id });
        if (listToUpdate) {
          listToUpdate.cards = [
            ...(listToUpdate.cards || []),
            {
              _id,
              title: "",
            },
          ];
        }
      });
      setData(lists);
      setTimeout(() => {
        const target = kanbanRef.current?.querySelector(
          `[data-card-id="${_id}"]`,
        );
        target?.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleAddNewListClick = useCallback(() => {
    const _id = isomorphicObjectId().toString();
    const lists = produce(dataRef.current, (draft) => {
      draft.push({
        _id,
        title: "",
      });
    });
    setData(lists);
    setTimeout(() => {
      const target = kanbanRef.current?.querySelector(
        `[data-list-id="${_id}"] [data-is-markdown]`,
      );
      target?.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleListDelete = useCallback(
    (list: IList) => () => {
      const listUpdated = find(dataRef.current, { _id: list._id });
      if (listUpdated?.cards?.length) {
        showNotification({
          icon: "error",
          message: "You can't delete a status with tasks",
        });
        return;
      }
      const lists = produce(dataRef.current, (draft) => {
        remove(draft, { _id: list._id });
      });
      setData(lists);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleListTitleChange = useCallback(
    (list: IList) => (title: string) => {
      if (title) {
        const lists = produce(dataRef.current, (draft) => {
          const listToUpdate = find(draft, { _id: list._id });
          if (listToUpdate) {
            listToUpdate.title = title;
          }
        });
        setData(lists);
      } else {
        handleListDelete(list)();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleCardDelete = useCallback(
    (card: ICard, list: IList) => () => {
      const lists = produce(dataRef.current, (draft) => {
        const listToUpdate = find(draft, { _id: list._id });
        if (listToUpdate?.cards) {
          remove(listToUpdate.cards, { _id: card._id });
        }
      });
      setData(lists);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleCardTitleChange = useCallback(
    (card: ICard, list: IList) => (title: string) => {
      if (title) {
        const lists = produce(dataRef.current, (draft) => {
          const listToUpdate = find(draft, { _id: list._id });
          if (listToUpdate?.cards) {
            const cardToUpdate = find(listToUpdate.cards, { _id: card._id });
            if (cardToUpdate) {
              cardToUpdate.title = title;
            }
          }
        });
        setData(lists);
      } else {
        handleCardDelete(card, list)();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleCardClick = useCallback(
    (card: ICard, list: IList) => () => {
      setDraggingCard(null);
      onClickCard?.({
        cardId: card._id,
        listId: list._id,
      });
    },
    [onClickCard],
  );

  const handleDuplicateTo = useCallback(
    (card: ICard, fromList: IList) => (toListId?: string) => {
      const lists = produce(dataRef.current, (draft) => {
        const fromListRef = find(draft, { _id: fromList._id });
        const clonedCard = find(fromListRef?.cards, { _id: card._id });
        if (toListId) {
          const toListToUpdate = find(draft, { _id: toListId });
          if (fromListRef && toListToUpdate) {
            if (clonedCard) {
              toListToUpdate.cards = [
                cloneDeep({
                  ...clonedCard,
                  _id: isomorphicObjectId().toString(),
                }),
                ...(toListToUpdate.cards || []),
              ];
            }
          }
        } else {
          if (clonedCard) {
            draft.push({
              _id: isomorphicObjectId().toString(),
              title: "New status",
              cards: [
                cloneDeep({
                  ...clonedCard,
                  _id: isomorphicObjectId().toString(),
                }),
              ],
            });
          }
        }
      });
      setData(lists);
    },
    [dataRef],
  );

  return (
    <div
      className={clsx(
        "group/kanban flex gap-2",
        {
          "flex-col": orientation === "vertical",
          "[&_*]:cursor-grab": !!draggingCard?.unstick,
        },
        className,
      )}
      data-is-dragging={!!draggingCard?.unstick}
      ref={kanbanRef}
    >
      {data.map((list) => (
        <div key={list._id.toString()} className="flex shrink-0 flex-col">
          <List
            title={list.title}
            dragging={
              draggingList?.dragElement && draggingList?.list._id === list._id
            }
            onDelete={handleListDelete(list)}
            _id={list._id}
            onChangeTitle={handleListTitleChange(list)}
            canEdit={canEditList}
          >
            {list.cards?.map((card) => (
              <Card
                key={card._id.toString()}
                title={card.title}
                dragging={
                  draggingCard?.dragElement &&
                  draggingCard?.card._id === card._id &&
                  draggingCard?.list._id === list._id
                }
                onDelete={handleCardDelete(card, list)}
                _id={card._id}
                listId={list._id}
                onChangeTitle={handleCardTitleChange(card, list)}
                onClick={handleCardClick(card, list)}
                cardName={cardName}
                cardAdditionalContent={cardAdditionalContent}
                cardAdditionalActions={cardAdditionalActions}
                uploadClipboardImage={uploadClipboardImage}
                lists={data}
                onDuplicateTo={handleDuplicateTo(card, list)}
                listName={listName}
              />
            ))}
            <Button
              variant="text"
              className="dark:hover:bg-tranparent hover:bg-tranparent pointer-events-auto justify-start rounded-lg p-2 text-left text-zinc-500 group-data-[is-dragging=false]/kanban:hover:bg-zinc-500/5 group-data-[is-dragging=false]/kanban:dark:hover:bg-white/5"
              leading={<PlusIcon className="-ml-0.5 mr-1" />}
              onClick={handleAddNewCardClick(list)}
            >
              Add new {cardName}
            </Button>
          </List>
        </div>
      ))}
      {canAddList && (
        <div className="flex shrink-0 flex-col">
          <Button
            variant="text"
            className="pointer-events-auto justify-start rounded-lg p-2 text-left text-zinc-500"
            leading={<PlusIcon className="-ml-0.5 mr-1" />}
            onClick={handleAddNewListClick}
            data-new-list-button=""
          >
            Add new {listName}
          </Button>
        </div>
      )}
    </div>
  );
}
