import { ComponentType, useCallback, useEffect, useRef, useState } from "react";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { cloneDeep, find, isEqual, last, remove } from "lodash-es";
import Button from "@italodeandra/ui/components/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useLatest } from "react-use";
import { ICard } from "./ICard";
import { IList } from "./IList";
import { Card } from "./Card";
import { List } from "./List";
import clsx from "@italodeandra/ui/utils/clsx";
import { produce } from "immer";
import { showNotification } from "@italodeandra/ui/components/Notifications/notifications.state";

export function Kanban<
  CAP extends Record<string, unknown>,
  LAP extends Record<string, unknown>,
>({
  orientation = "horizontal",
  onClickCard,
  data: dataProp,
  cardName = "card",
  listName = "list",
  onChange,
  cardAdditionalContent,
  cardAdditionalProps,
  cardAdditionalActions,
  listAdditionalActions,
  listAdditionalProps,
  className,
  uploadClipboardImage,
  canAddList,
  canEditList,
  canDuplicateCard,
  canAddCard,
  canEditCard,
  canDeleteCard,
  canMoveCardTo,
}: {
  orientation?: "horizontal" | "vertical";
  onClickCard?: (selected: { cardId: string; listId: string }) => void;
  data: IList[];
  cardName?: string;
  listName?: string;
  onChange?: (data: IList[]) => void;
  cardAdditionalContent?: ComponentType<
    { cardId: string; listId: string; dragging: boolean } & CAP
  >;
  cardAdditionalActions?: ComponentType<
    { cardId: string; listId: string } & CAP
  >;
  listAdditionalActions?: ComponentType<{ listId: string } & LAP>;
  className?: string;
  uploadClipboardImage?: (image: string) => Promise<string>;
  canAddList?: boolean;
  canMoveList?: boolean;
  canEditList?: boolean;
  cardAdditionalProps?: CAP;
  listAdditionalProps?: LAP;
  canDuplicateCard?: boolean;
  canAddCard?: boolean;
  canEditCard?:
    | boolean
    | ((listId: string, cardId: string) => boolean | undefined);
  canMoveCard?: boolean;
  canDeleteCard?:
    | boolean
    | ((listId: string, cardId: string) => boolean | undefined);
  canMoveCardTo?: boolean;
}) {
  const [data, setData] = useState<IList[]>(dataProp);
  const dataRef = useLatest(data);
  const kanbanRef = useRef<HTMLDivElement>(null);

  const checkCanEditCard = useCallback(
    (listId: string, cardId: string) => {
      if (typeof canEditCard === "function") {
        return canEditCard(listId, cardId);
      }
      return canEditCard;
    },
    [canEditCard],
  );

  const checkCanDeleteCard = useCallback(
    (listId: string, cardId: string) => {
      if (typeof canDeleteCard === "function") {
        return canDeleteCard(listId, cardId);
      }
      return canDeleteCard;
    },
    [canDeleteCard],
  );

  useEffect(() => {
    if (!isEqual(data, dataProp)) {
      setData(dataProp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataProp]);

  useEffect(() => {
    if (onChange && !isEqual(data, dataProp)) {
      onChange(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
              isNew: true,
            },
          ];
        }
      });
      setData(lists);
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
        order: (last(draft)?.order || 0) + 1,
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
          message: `You can't delete a ${listName} with ${cardName}`,
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
              order: (last(draft)?.order || 0) + 1,
            });
          }
        }
      });
      setData(lists);
    },
    [dataRef],
  );

  const handleMoveCardToList = useCallback(
    (card: ICard, fromList: IList) => (toListId?: string) => {
      const lists = produce(dataRef.current, (draft) => {
        const fromListRef = find(draft, { _id: fromList._id });
        const cardRef = find(fromListRef?.cards, { _id: card._id });
        if (toListId && cardRef) {
          const toListRef = find(draft, { _id: toListId });
          if (toListRef && fromListRef?.cards) {
            remove(fromListRef?.cards, { _id: card._id });
            toListRef.cards = toListRef.cards || [];
            toListRef.cards.unshift(cardRef);
          }
        }
      });
      setData(lists);
    },
    [dataRef],
  );

  const handleListMove = useCallback(
    (list: IList, toIndex: number) => () => {
      const lists = produce(dataRef.current, (draft) => {
        const listIndex = draft.findIndex((l) => l._id === list._id);
        if (listIndex !== -1) {
          const [removed] = draft.splice(listIndex, 1);
          draft.splice(toIndex, 0, removed);
        }
      });
      setData(lists);
    },
    [dataRef],
  );

  return (
    <div
      className={clsx(
        "group/kanban flex gap-2 touch:flex-col",
        {
          "flex-col": orientation === "vertical",
        },
        className,
      )}
      ref={kanbanRef}
    >
      {data.map((list, index, listArray) => (
        <div key={list._id.toString()} className="flex shrink-0 flex-col">
          <List
            title={list.title}
            onDelete={handleListDelete(list)}
            _id={list._id}
            onChangeTitle={handleListTitleChange(list)}
            canEdit={canEditList}
            listName={listName}
            additionalActions={listAdditionalActions}
            additionalProps={listAdditionalProps}
            canMoveLeft={index > 0}
            onMoveLeft={handleListMove(list, index - 1)}
            canMoveRight={index < listArray.length - 1}
            onMoveRight={handleListMove(list, index + 1)}
          >
            {list.cards?.map((card) => (
              <Card
                key={card._id.toString()}
                title={card.title}
                onDelete={handleCardDelete(card, list)}
                _id={card._id}
                listId={list._id}
                onChangeTitle={handleCardTitleChange(card, list)}
                onClick={handleCardClick(card, list)}
                cardName={cardName}
                additionalContent={cardAdditionalContent}
                additionalActions={cardAdditionalActions}
                additionalProps={cardAdditionalProps}
                uploadClipboardImage={uploadClipboardImage}
                lists={data}
                onDuplicateTo={handleDuplicateTo(card, list)}
                listName={listName}
                canDuplicate={canDuplicateCard}
                canEdit={checkCanEditCard(list._id, card._id)}
                canDelete={checkCanDeleteCard(list._id, card._id)}
                isNew={card.isNew}
                canMoveTo={canMoveCardTo}
                onMoveTo={handleMoveCardToList(card, list)}
              />
            ))}
            {canAddCard && (
              <Button
                variant="text"
                className="dark:hover:bg-tranparent hover:bg-tranparent pointer-events-auto justify-start rounded-lg p-2 text-left text-zinc-500 group-data-[is-dragging=false]/kanban:hover:bg-zinc-500/5 group-data-[is-dragging=false]/kanban:dark:hover:bg-white/5"
                leading={<PlusIcon className="-ml-0.5 mr-1" />}
                onClick={handleAddNewCardClick(list)}
              >
                Add new {cardName}
              </Button>
            )}
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
