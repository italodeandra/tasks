import {
  ComponentType,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent as RMouseEvent,
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
import { EllipsisVerticalIcon, PlusIcon } from "@heroicons/react/16/solid";
import { IList } from "./IList";
import { omit } from "lodash-es";

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
  additionalContent: AdditionalContent,
  additionalActions: AdditionalActions,
  additionalProps,
  uploadClipboardImage,
  onDuplicateTo,
  lists,
  listName,
  canDuplicate,
  canEdit,
  canDelete,
  isNew,
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
  additionalContent?: ComponentType<
    { cardId: string; listId: string; dragging: boolean } & AP
  >;
  additionalActions?: ComponentType<{ cardId: string; listId: string } & AP>;
  additionalProps?: AP;
  uploadClipboardImage?: (image: string) => Promise<string>;
  onDuplicateTo?: (listId?: string) => void;
  listName: string;
  lists: IList[];
  canDuplicate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  isNew?: boolean;
} & Omit<HTMLAttributes<HTMLDivElement>, "onClick">) {
  const editableRef = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState(isNew || false);
  const clickTimeout = useRef(0);
  const triggerRef = useRef<HTMLDivElement>(null);

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
    (event: RMouseEvent) => {
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

  const handleOptionsClick = useCallback((event: RMouseEvent) => {
    triggerRef.current?.dispatchEvent(
      new MouseEvent("contextmenu", omit(event, "view")),
    );
  }, []);

  return (
    <ContextMenu.Root modal>
      <ContextMenu.Trigger asChild>
        <div
          ref={triggerRef}
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
            {!editing && AdditionalContent && (
              <AdditionalContent
                cardId={_id}
                listId={listId}
                dragging={!!dragging}
                {...(additionalProps as AP)}
              />
            )}
            {!editing && (
              <Button
                icon
                variant="text"
                size="xs"
                className={clsx(
                  "absolute right-9 top-2 hidden opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 group-focus:pointer-events-auto group-focus:opacity-100 touch:flex dark:bg-zinc-700 dark:hover:bg-zinc-600",
                  "group-data-[is-dragging=true]/kanban:hidden",
                )}
                tabIndex={-1}
                onClick={handleOptionsClick}
                onTouchStart={stopPropagation}
                onMouseDown={stopPropagation}
              >
                <EllipsisVerticalIcon className="pointer-events-none" />
              </Button>
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
          {AdditionalActions && (
            <AdditionalActions
              cardId={_id}
              listId={listId}
              {...(additionalProps as AP)}
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
