import { HTMLAttributes, MouseEvent, useCallback, useState } from "react";
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

function Card({
  title,
  dragging,
  onMouseDown,
  ...props
}: {
  title: string;
  dragging?: boolean;
} & HTMLAttributes<HTMLDivElement>) {
  const [editing, setEditing] = useState(false);

  const handleDoubleClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    setEditing(true);
    const target = e.currentTarget;
    setTimeout(() => {
      target.focus();
    });
  }, []);

  const handleBlur = useCallback(() => {
    setEditing(false);
  }, []);

  return (
    <div
      className={clsx(
        "p-2 bg-zinc-800 rounded-lg shadow-md outline-0 transition-colors",
        {
          "grayscale opacity-30": dragging,
          "cursor-pointer": !editing,
          "ring-2 ring-zinc-700 focus:ring-primary-500": editing,
        }
      )}
      data-is-card={true}
      contentEditable={editing}
      {...props}
      onDoubleClick={handleDoubleClick}
      onMouseDown={!editing ? onMouseDown : undefined}
      onBlur={handleBlur}
      dangerouslySetInnerHTML={{
        __html: title,
      }}
    />
  );
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
            title: "Coding<br><br>Test",
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
    dragElement?: HTMLDivElement;
    startMousePos: {
      x: number;
      y: number;
    };
  } | null>(null);
  const draggingCardRef = useLatest(draggingCard);

  const [draggingList, setDraggingList] = useState<{
    list: List;
    originalElement: HTMLDivElement;
    dragElement?: HTMLDivElement;
    startMousePos: {
      x: number;
      y: number;
    };
  } | null>(null);
  const draggingListRef = useLatest(draggingList);

  const handleCardMouseDown = useCallback(
    (card: Card, list: List) => (event: MouseEvent) => {
      const originalElement = event.currentTarget as HTMLDivElement;

      setDraggingCard({
        card,
        list,
        startMousePos: {
          x: event.clientX,
          y: event.clientY,
        },
        originalElement,
      });
    },
    []
  );

  const handleListMouseDown = useCallback(
    (list: List) => (event: MouseEvent) => {
      const isNotOverCard = (event.target as HTMLDivElement).getAttribute(
        "data-is-card"
      );
      if (!isNotOverCard) {
        const originalElement = event.currentTarget as HTMLDivElement;

        setDraggingList({
          list,
          startMousePos: {
            x: event.clientX,
            y: event.clientY,
          },
          originalElement,
        });
      }
    },
    []
  );

  const handleKanbanMouseMove = useCallback(
    (event: MouseEvent) => {
      if (draggingCardRef.current) {
        document.body.classList.add("select-none");
        const { startMousePos, originalElement } = draggingCardRef.current;
        let dragElement = draggingCardRef.current.dragElement;
        if (!dragElement) {
          const originalElementRect = originalElement.getBoundingClientRect();
          dragElement = originalElement.cloneNode(true) as HTMLDivElement;
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
            ...draggingCardRef.current,
            dragElement,
          });
        }

        dragElement.style.setProperty(
          "--x",
          `${event.clientX - startMousePos.x}px`
        );
        dragElement.style.setProperty(
          "--y",
          `${event.clientY - startMousePos.y}px`
        );
      }
      if (draggingListRef.current) {
        document.body.classList.add("select-none");
        const { startMousePos, originalElement } = draggingListRef.current;
        let dragElement = draggingListRef.current.dragElement;
        if (!dragElement) {
          const originalElementRect = originalElement.getBoundingClientRect();
          dragElement = originalElement.cloneNode(true) as HTMLDivElement;
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
          setDraggingList({
            ...draggingListRef.current,
            dragElement,
          });
        }

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
    [draggingCardRef, draggingListRef]
  );

  const handleCardMouseMove = useCallback(
    (card: Card, list: List) => () => {
      if (draggingCardRef.current) {
        if (draggingCardRef.current.card._id !== card._id) {
          if (draggingCardRef.current.list._id === list._id) {
            const newData = { ...dataRef.current };
            const lists = newData.lists || [];
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

  const handleListDropAreaMouseMove = useCallback(
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

  const handleListMouseMove = useCallback(
    (list: List) => () => {
      if (draggingListRef.current) {
        if (draggingListRef.current.list._id !== list._id) {
          const newData = { ...dataRef.current };
          if (newData.lists) {
            const previousIndex = findIndex(newData.lists, {
              _id: draggingListRef.current.list._id,
            });
            const nextIndex = findIndex(newData.lists, {
              _id: list._id,
            });
            move(newData.lists, previousIndex, nextIndex);
            setData(newData);
          }
        }
      }
    },
    [dataRef, draggingListRef]
  );

  const handleKanbanMouseUp = useCallback(() => {
    if (draggingCardRef.current) {
      if (draggingCardRef.current.dragElement) {
        draggingCardRef.current.dragElement.parentElement!.removeChild(
          draggingCardRef.current.dragElement
        );
      }
      draggingCardRef.current.originalElement.classList.remove("opacity-50");
      setDraggingCard(null);
    }
    if (draggingListRef.current) {
      if (draggingListRef.current.dragElement) {
        draggingListRef.current.dragElement.parentElement!.removeChild(
          draggingListRef.current.dragElement
        );
      }
      draggingListRef.current.originalElement.classList.remove("opacity-50");
      setDraggingList(null);
    }
    document.body.classList.remove("select-none");
  }, [draggingCardRef, draggingListRef]);

  return (
    <div
      className="p-2 flex gap-2 h-full"
      onMouseUp={handleKanbanMouseUp}
      onMouseLeave={handleKanbanMouseUp}
      onMouseMove={handleKanbanMouseMove}
    >
      {data.lists?.map((list) => (
        <div
          key={list._id.toString()}
          className="flex flex-col"
          onMouseMove={handleListMouseMove(list)}
        >
          <div
            className={clsx("p-2 bg-zinc-900 rounded-xl flex flex-col gap-2", {
              "grayscale opacity-30":
                draggingList?.dragElement &&
                draggingList?.list._id === list._id,
            })}
            onMouseDown={handleListMouseDown(list)}
          >
            <div className="font-medium text-sm px-1">{list.title}</div>
            {list.cards?.map((card) => (
              <Card
                key={card._id.toString()}
                dragging={
                  draggingCard?.dragElement &&
                  draggingCard?.card._id === card._id &&
                  draggingCard?.list._id === list._id
                }
                onMouseDown={handleCardMouseDown(card, list)}
                onMouseMove={handleCardMouseMove(card, list)}
                title={card.title}
              />
            ))}
            <Button
              variant="text"
              className="rounded-lg text-left justify-start p-2"
              leading={<PlusIcon className="w-4 h-4 mr-1" />}
              onMouseMove={handleListDropAreaMouseMove(list)}
              onMouseDown={(e) => e.stopPropagation()}
            >
              Add new task
            </Button>
          </div>
          <div
            onMouseMove={handleListDropAreaMouseMove(list)}
            className="grow"
          />
        </div>
      ))}
    </div>
  );
}

// TODO: fix dragging small task into big task
