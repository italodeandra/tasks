import { useCallback, useEffect, useRef, useState } from "react";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { find, findIndex, remove } from "lodash-es";
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
  return document.elementFromPoint(
    mousePos.clientX,
    mousePos.clientY,
  ) as HTMLDivElement;
}

export function Trello({
  orientation = "horizontal",
}: {
  orientation?: "horizontal" | "vertical";
}) {
  const [data, setData] = useState<{
    lists?: IList[];
  }>({
    lists: [
      {
        _id: "665e78c7b3d3cf0f86db4c8d",
        title: "Todo",
        cards: [
          {
            _id: "665e78f7c9e5ab7e262c1e9a",
            title: "Buy milk",
          },
          {
            _id: "665e78f9f32b8de9e1532975",
            title: "Buy bread",
          },
          {
            _id: "665f2378c6316ed4eefbaed8",
            title: "Buy eggs",
          },
        ],
      },
      {
        _id: "665f23b72ca02db00eafcb23",
        title: "Doing",
        cards: [
          {
            _id: "665fdb6c403542034d819d2f",
            title: "Coding<br><br>Test",
          },
        ],
      },
    ],
  });
  const dataRef = useLatest(data);
  const trelloRef = useRef<HTMLDivElement>(null);

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
        trelloRef.current!.classList.remove("pointer-events-none");
      }
      const target = getMousePosTarget(mousePos);
      if (isTouchDevice) {
        trelloRef.current!.classList.add("pointer-events-none");
      }
      const cardId = target
        .closest("[data-card-id]")
        ?.getAttribute("data-card-id");
      const listId = target
        .closest("[data-list-id]")
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
      trelloRef.current!.classList.add("pointer-events-none");
    }

    const handleKanbanMouseUp = (event: MouseEvent | TouchEvent) => {
      removeDragElements();

      if (draggingCardRef.current) {
        const mousePos = getMousePos(event);
        const target = getMousePosTarget(mousePos);
        const newListButton = target.closest("[data-new-list-button]");
        if (newListButton) {
          const newData = { ...dataRef.current };
          const lists = dataRef.current.lists || [];
          const previousList = find(lists, {
            _id: draggingCardRef.current.list._id,
          });
          if (previousList?.cards) {
            remove(previousList.cards, {
              _id: draggingCardRef.current.card._id,
            });
            lists.push({
              _id: isomorphicObjectId().toString(),
              title: "New list",
              cards: [draggingCardRef.current.card],
            });
            setData({
              ...newData,
              lists,
            });
          }
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
            if (cardId) {
              const newData = { ...dataRef.current };
              const lists = newData.lists || [];
              const listToUpdate = find(lists, { _id: listId });
              if (listToUpdate?.cards) {
                const previousIndex = findIndex(listToUpdate.cards, {
                  _id: draggingCardRef.current.card._id,
                });
                const nextIndex = findIndex(listToUpdate.cards, {
                  _id: cardId,
                });
                const hoveredElementRect = target.getBoundingClientRect();
                const movingElementRect =
                  draggingCardRef.current.dragElement?.getBoundingClientRect();
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
                  setData(newData);
                }
              }
            }
          } else {
            if (listId) {
              const newData = { ...dataRef.current };
              const lists = dataRef.current.lists || [];
              const previousList = find(lists, {
                _id: draggingCardRef.current.list._id,
              });
              const nextList = find(lists, { _id: listId });
              if (previousList?.cards && nextList) {
                nextList.cards = nextList.cards || [];
                if (
                  !nextList.cards.some(
                    (c) => c._id === draggingCardRef.current!.card._id,
                  )
                ) {
                  remove(previousList.cards, {
                    _id: draggingCardRef.current.card._id,
                  });
                  const nextIndex = cardId
                    ? findIndex(nextList.cards, {
                        _id: cardId,
                      })
                    : nextList.cards.length;
                  nextList.cards.splice(
                    nextIndex,
                    0,
                    draggingCardRef.current.card,
                  );
                  setData({
                    ...newData,
                    lists,
                  });
                  setDraggingCard({
                    ...draggingCardRef.current!,
                    list: nextList,
                  });
                }
              }
            }
          }
        }
      }

      // moving list
      if (draggingListRef.current && listId) {
        if (draggingListRef.current.list._id !== listId) {
          const newData = { ...dataRef.current };
          if (newData.lists) {
            const previousIndex = findIndex(newData.lists, {
              _id: draggingListRef.current.list._id,
            });
            const nextIndex = findIndex(newData.lists, {
              _id: listId,
            });
            move(newData.lists, previousIndex, nextIndex);
            setData(newData);
          }
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
      if (!draggingCardRef.current?.unstick) {
        if (
          cardId &&
          isTouchDevice &&
          !target.getAttribute("class")?.includes("pointer-events-auto")
        ) {
          target.focus();
        }
      }
      if (target.getAttribute("data-is-editing") !== "true")
        if (!cardId) {
          if (listId) {
            const list = find(dataRef.current.lists, { _id: listId });
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
            const list = find(dataRef.current.lists, { _id: listId });
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

  const handleAddNewTaskClick = useCallback(
    (list: IList) => () => {
      const newData = { ...dataRef.current };
      const lists = newData.lists || [];
      const listToUpdate = find(lists, { _id: list._id });
      if (listToUpdate) {
        listToUpdate.cards = [
          ...(listToUpdate.cards || []),
          {
            _id: isomorphicObjectId().toString(),
            title: "New task",
          },
        ];
        setData(newData);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleAddNewListClick = useCallback(() => {
    const newData = { ...dataRef.current };
    const lists = newData.lists || [];
    lists.push({
      _id: isomorphicObjectId().toString(),
      title: "New list",
    });
    setData(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleListDelete = useCallback(
    (list: IList) => () => {
      const newData = { ...dataRef.current };
      const lists = newData.lists || [];
      remove(lists, { _id: list._id });
      setData(newData);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleListTitleChange = useCallback(
    (list: IList) => (title: string) => {
      const newData = { ...dataRef.current };
      const lists = newData.lists || [];
      const listToUpdate = find(lists, { _id: list._id });
      if (listToUpdate) {
        listToUpdate.title = title;
        setData(newData);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleTaskDelete = useCallback(
    (card: ICard, list: IList) => () => {
      const newData = { ...dataRef.current };
      const lists = newData.lists || [];
      const listToUpdate = find(lists, { _id: list._id });
      if (listToUpdate?.cards) {
        remove(listToUpdate.cards, { _id: card._id });
        setData(newData);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleTaskTitleChange = useCallback(
    (card: ICard, list: IList) => (title: string) => {
      const newData = { ...dataRef.current };
      const lists = newData.lists || [];
      const listToUpdate = find(lists, { _id: list._id });
      if (listToUpdate?.cards) {
        const cardToUpdate = find(listToUpdate.cards, { _id: card._id });
        if (cardToUpdate) {
          cardToUpdate.title = title;
          setData(newData);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <div
      className={clsx("group/kanban flex h-full gap-2 p-2", {
        "flex-col": orientation === "vertical",
      })}
      data-is-dragging={!!draggingCard?.unstick}
      ref={trelloRef}
    >
      {data.lists?.map((list) => (
        <div key={list._id.toString()} className="flex shrink-0 flex-col">
          <List
            title={list.title}
            dragging={
              draggingList?.dragElement && draggingList?.list._id === list._id
            }
            onDelete={handleListDelete(list)}
            _id={list._id}
            onChangeTitle={handleListTitleChange(list)}
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
                onDelete={handleTaskDelete(card, list)}
                _id={card._id}
                onChangeTitle={handleTaskTitleChange(card, list)}
              />
            ))}
            <Button
              variant="text"
              className="dark:hover:bg-tranparent hover:bg-tranparent pointer-events-auto justify-start rounded-lg p-2 text-left text-zinc-500 group-data-[is-dragging=false]/kanban:hover:bg-zinc-500/5 group-data-[is-dragging=false]/kanban:dark:hover:bg-white/5"
              leading={<PlusIcon className="-ml-0.5 mr-1" />}
              onClick={handleAddNewTaskClick(list)}
            >
              Add new task
            </Button>
          </List>
        </div>
      ))}
      <div className="flex shrink-0 flex-col">
        <Button
          variant="text"
          className="pointer-events-auto justify-start rounded-lg p-2 text-left text-zinc-500"
          leading={<PlusIcon className="-ml-0.5 mr-1" />}
          onClick={handleAddNewListClick}
          data-new-list-button=""
        >
          Add new list
        </Button>
      </div>
    </div>
  );
}
