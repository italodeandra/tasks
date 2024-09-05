import {
  ComponentType,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import clsx from "@italodeandra/ui/utils/clsx";
import ContextMenu from "@italodeandra/ui/components/ContextMenu";
import Button from "@italodeandra/ui/components/Button";
import { PencilIcon } from "@heroicons/react/24/solid";
import stopPropagation from "@italodeandra/ui/utils/stopPropagation";
import { MarkdownEditor } from "./MarkdownEditor";
import { dropdownItemIndicatorClassName } from "@italodeandra/ui/styles/Dropdown.classNames";
import { PlusIcon } from "@heroicons/react/16/solid";
import { IList } from "./IList";

export function Card<AP extends Record<string, unknown>>({
  title,
  dragging,
  className,
  onDelete,
  onChangeTitle,
  onClick,
  _id,
  listId,
  cardName,
  cardAdditionalContent: CardAdditionalContent,
  cardAdditionalActions: CardAdditionalActions,
  cardAdditionalProps,
  uploadClipboardImage,
  onDuplicateTo,
  lists,
  listName,
  canDuplicate,
  canEdit,
  canDelete,
  ...props
}: {
  title: string;
  dragging?: boolean;
  onDelete?: () => void;
  onChangeTitle?: (title: string) => void;
  onClick?: () => void;
  cardName: string;
  _id: string;
  listId: string;
  cardAdditionalContent?: ComponentType<
    { cardId: string; listId: string; dragging: boolean } & AP
  >;
  cardAdditionalActions?: ComponentType<
    { cardId: string; listId: string } & AP
  >;
  cardAdditionalProps?: AP;
  uploadClipboardImage?: (image: string) => Promise<string>;
  onDuplicateTo?: (listId?: string) => void;
  listName: string;
  lists: IList[];
  canDuplicate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
} & Omit<HTMLAttributes<HTMLDivElement>, "onClick">) {
  const editableRef = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState(false);
  const clickTimeout = useRef(0);

  const handleEdit = useCallback(() => {
    setEditing(true);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (!editing && e.key === "Enter") {
        handleEdit();
      }
    },
    [editing, handleEdit],
  );

  const handleDoubleClick = useCallback(() => {
    clearTimeout(clickTimeout.current);
    handleEdit();
  }, [handleEdit]);

  const handleClick = useCallback(() => {
    clearTimeout(clickTimeout.current);
    if (onClick) {
      clickTimeout.current = window.setTimeout(() => {
        onClick();
      }, 300);
    }
  }, [onClick]);

  const handleMouseLeftDown = useCallback(
    (event: MouseEvent) => {
      if (event.button === 0) {
        handleClick();
      }
    },
    [handleClick],
  );

  useEffect(() => {
    clearTimeout(clickTimeout.current);
  }, [dragging]);

  const handleDuplicateTo = useCallback(
    (toList?: (typeof lists)[0]) => () => {
      onDuplicateTo?.(toList?._id);
    },
    [onDuplicateTo],
  );

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        <div
          {...props}
          className={clsx(
            "group max-w-96 rounded-lg bg-zinc-800 shadow-md outline-none transition-colors",
            "ring-zinc-700 focus:ring-2 focus:ring-primary-800",
            {
              "group-data-[is-dragging=false]/kanban:hover:bg-zinc-700":
                !editing && onChangeTitle && canEdit,
              "cursor-grab opacity-30 grayscale": dragging,
              "ring-2 ring-primary-500": editing,
              "cursor-pointer": onClick && !editing,
            },
            className,
          )}
          onDoubleClick={
            onChangeTitle && canEdit ? handleDoubleClick : undefined
          }
          onKeyDown={handleKeyDown}
          tabIndex={0}
          data-card-id={_id}
          onMouseDown={!editing ? handleMouseLeftDown : undefined}
          onTouchStart={!editing ? handleClick : undefined}
        >
          <div className="pointer-events-none relative">
            <MarkdownEditor
              ref={editableRef}
              value={title}
              onChange={onChangeTitle}
              editing={editing}
              onChangeEditing={setEditing}
              className="p-3"
              uploadClipboardImage={uploadClipboardImage}
            />
            {!editing && CardAdditionalContent && (
              <CardAdditionalContent
                cardId={_id}
                listId={listId}
                dragging={!!dragging}
                {...(cardAdditionalProps as AP)}
              />
            )}
            {!editing && canEdit && (
              <Button
                icon
                variant="text"
                size="xs"
                className={clsx(
                  "absolute right-2 top-2 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 group-focus:pointer-events-auto group-focus:opacity-100 dark:bg-zinc-700 dark:hover:bg-zinc-600",
                  "group-data-[is-dragging=true]/kanban:hidden",
                )}
                tabIndex={-1}
                onClick={handleEdit}
                onTouchStart={stopPropagation}
                onMouseDown={stopPropagation}
              >
                <PencilIcon className="pointer-events-none" />
              </Button>
            )}
          </div>
        </div>
      </ContextMenu.Trigger>
      {canEdit && (
        <ContextMenu.Content>
          {CardAdditionalActions && (
            <CardAdditionalActions
              cardId={_id}
              listId={listId}
              {...(cardAdditionalProps as AP)}
            />
          )}
          {canDuplicate && !!lists.length && (
            <ContextMenu.Sub>
              <ContextMenu.SubTrigger>Duplicate to</ContextMenu.SubTrigger>
              <ContextMenu.SubContent>
                {lists.map((list) => (
                  <ContextMenu.Item
                    key={list._id}
                    onClick={handleDuplicateTo(list)}
                  >
                    {list.title}
                  </ContextMenu.Item>
                ))}
                <ContextMenu.Item onClick={handleDuplicateTo()}>
                  <div className={dropdownItemIndicatorClassName}>
                    <PlusIcon />
                  </div>
                  New {listName}
                </ContextMenu.Item>
              </ContextMenu.SubContent>
            </ContextMenu.Sub>
          )}
          <ContextMenu.Item onClick={handleEdit}>
            Edit {cardName}
          </ContextMenu.Item>
          {canDelete && (
            <ContextMenu.Item onClick={onDelete}>
              Delete {cardName}
            </ContextMenu.Item>
          )}
        </ContextMenu.Content>
      )}
    </ContextMenu.Root>
  );
}
