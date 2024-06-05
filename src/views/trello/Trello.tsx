import { MouseEvent, useCallback, useState } from "react";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { ObjectId } from "bson";
import { find, findIndex, pullAt, remove, uniqBy } from "lodash";
import Button from "@italodeandra/ui/components/Button";
import { PlusIcon } from "@heroicons/react/16/solid";
import { useLatest } from "react-use";
import clsx from "@italodeandra/ui/utils/clsx";

interface Card {
  _id: ObjectId;
  title: string;
}

interface List {
  _id: ObjectId;
  title: string;
  cards?: Card[];
}

interface Data {
  lists?: List[];
}

function move<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  // Remove the item from the original index
  const item: T = pullAt(array, fromIndex)[0];

  // Insert the item at the new index
  array.splice(toIndex, 0, item);

  return array;
}

export function Trello() {
  const [data, setData] = useState<Data>({
    lists: [
      {
        _id: isomorphicObjectId("665e78c7b3d3cf0f86db4c8d"),
        title: "Todo",
        cards: [
          {
            _id: isomorphicObjectId("665e78f7c9e5ab7e262c1e9a"),
            title: "Buy milk",
          },
          {
            _id: isomorphicObjectId("665e78f9f32b8de9e1532975"),
            title: "Buy bread",
          },
          {
            _id: isomorphicObjectId("665f2378c6316ed4eefbaed8"),
            title: "Buy eggs",
          },
        ],
      },
      {
        _id: isomorphicObjectId("665f23b72ca02db00eafcb23"),
        title: "Doing",
        cards: [
          {
            _id: isomorphicObjectId("665fdb6c403542034d819d2f"),
            title: "Coding",
          },
        ],
      },
    ],
  });
  const dataRef = useLatest(data);

  const [draggingCard, setDraggingCard] = useState<{
    card: Card;
    list: List;
    originalElement: HTMLDivElement;
    dragElement: HTMLDivElement;
    startMousePos: {
      x: number;
      y: number;
    };
  } | null>(null);
  const draggingCardRef = useLatest(draggingCard);

  const handleCardMouseDown = useCallback(
    (card: Card, list: List) => (event: MouseEvent) => {
      const originalElement = event.currentTarget as HTMLDivElement;
      const originalElementRect = originalElement.getBoundingClientRect();
      const dragElement = originalElement.cloneNode(true) as HTMLDivElement;
      dragElement.style.left = `${originalElementRect.left}px`;
      dragElement.style.top = `${originalElementRect.top}px`;
      dragElement.style.width = `${originalElementRect.width}px`;
      dragElement.style.height = `${originalElementRect.height}px`;
      dragElement.classList.add(
        "absolute",
        "rotate-6",
        "translate-x-[--x]",
        "translate-y-[--y]",
        "pointer-events-none",
        "z-10",
        "opacity-90"
      );
      originalElement.parentElement!.prepend(dragElement);

      setDraggingCard({
        card,
        list,
        startMousePos: {
          x: event.clientX,
          y: event.clientY,
        },
        originalElement,
        dragElement,
      });
    },
    []
  );

  const handleKanbanMouseMove = useCallback(
    (event: MouseEvent) => {
      if (draggingCardRef.current) {
        const { startMousePos, dragElement } = draggingCardRef.current;
        dragElement.style.setProperty(
          "--x",
          `${event.clientX - startMousePos.x}px`
        );
        dragElement.style.setProperty(
          "--y",
          `${event.clientY - startMousePos.y}px`
        );
      }
    },
    [draggingCardRef]
  );

  const handleKanbanMouseUp = useCallback(() => {
    if (draggingCardRef.current) {
      draggingCardRef.current.dragElement.parentElement!.removeChild(
        draggingCardRef.current.dragElement
      );
      draggingCardRef.current.originalElement.classList.remove("opacity-50");
      setDraggingCard(null);
    }
  }, [draggingCardRef]);

  const handleCardMouseMove = useCallback(
    (card: Card, list: List) => () => {
      if (draggingCardRef.current) {
        if (draggingCardRef.current.card._id !== card._id) {
          if (draggingCardRef.current.list._id === list._id) {
            const newData = { ...dataRef.current };
            const lists = dataRef.current.lists || [];
            const listToUpdate = find(lists, { _id: list._id });
            if (listToUpdate?.cards) {
              const previousIndex = findIndex(listToUpdate.cards, {
                _id: draggingCardRef.current.card._id,
              });
              const nextIndex = findIndex(listToUpdate.cards, {
                _id: card._id,
              });
              move(listToUpdate.cards, previousIndex, nextIndex);
              setData(newData);
            }
          } else {
            const newData = { ...dataRef.current };
            const lists = dataRef.current.lists || [];
            const previousList = find(lists, {
              _id: draggingCardRef.current.list._id,
            });
            const nextList = find(lists, { _id: list._id });
            if (previousList?.cards && nextList?.cards) {
              remove(previousList.cards, {
                _id: draggingCardRef.current.card._id,
              });
              const nextIndex = findIndex(nextList.cards, {
                _id: card._id,
              });
              nextList.cards.splice(nextIndex, 0, draggingCardRef.current.card);
              setData({
                ...newData,
                lists: lists.map((l) => ({
                  ...l,
                  cards: uniqBy(l.cards, (c) => c._id.toString()),
                })),
              });
              setDraggingCard({
                ...draggingCardRef.current!,
                list: nextList,
              });
            }
          }
        }
      }
    },
    [dataRef, draggingCardRef]
  );

  const handleListMouseMove = useCallback(
    (list: List) => (event: MouseEvent) => {
      const isNotOverCard = (event.target as HTMLDivElement).getAttribute(
        "data-is-card"
      );
      if (draggingCardRef.current && !isNotOverCard) {
        if (draggingCardRef.current.list._id !== list._id) {
          const newData = { ...dataRef.current };
          const lists = dataRef.current.lists || [];
          const previousList = find(lists, {
            _id: draggingCardRef.current.list._id,
          });
          const nextList = find(lists, { _id: list._id });
          if (previousList?.cards && nextList) {
            remove(previousList.cards, {
              _id: draggingCardRef.current.card._id,
            });
            nextList.cards = [
              ...(nextList.cards || []),
              draggingCardRef.current.card,
            ];
            setData({
              ...newData,
              lists: lists.map((l) => ({
                ...l,
                cards: uniqBy(l.cards, (c) => c._id.toString()),
              })),
            });
            setDraggingCard({
              ...draggingCardRef.current!,
              list: nextList,
            });
          }
        }
      }
    },
    [dataRef, draggingCardRef]
  );

  return (
    <div
      className="p-2 flex gap-2 h-full"
      onMouseUp={handleKanbanMouseUp}
      onMouseLeave={handleKanbanMouseUp}
      onMouseMove={handleKanbanMouseMove}
    >
      {data.lists?.map((list) => (
        <div key={list._id.toString()} className="flex flex-col">
          <div className="p-2 bg-zinc-900 rounded-xl flex flex-col gap-2">
            <div className="font-medium text-sm px-1">{list.title}</div>
            {list.cards?.map((card) => (
              <div
                key={card._id.toString()}
                className={clsx(
                  "p-2 bg-zinc-800 rounded-lg shadow-md select-none cursor-pointer",
                  {
                    "grayscale opacity-30":
                      draggingCard?.card._id === card._id &&
                      draggingCard?.list._id === list._id,
                  }
                )}
                data-is-card={true}
                onMouseDown={handleCardMouseDown(card, list)}
                onMouseMove={handleCardMouseMove(card, list)}
              >
                {card.title}
              </div>
            ))}
            <Button
              variant="text"
              className="rounded-lg text-left justify-start p-2"
              leading={<PlusIcon className="w-4 h-4 mr-1" />}
              onMouseMove={handleListMouseMove(list)}
            >
              Add new task
            </Button>
          </div>
          <div onMouseMove={handleListMouseMove(list)} className="grow" />
        </div>
      ))}
    </div>
  );
}
