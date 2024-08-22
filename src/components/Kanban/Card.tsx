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

export function Card({
  title,
  dragging,
  className,
  onDelete,
  onChangeTitle,
  onClick,
  _id,
  cardName,
  cardAdditionalContent: CardAdditionalContent,
  cardAdditionalActions: CardAdditionalActions,
  uploadClipboardImage,
  ...props
}: {
  title: string;
  dragging?: boolean;
  onDelete?: () => void;
  onChangeTitle?: (title: string) => void;
  onClick?: () => void;
  cardName: string;
  _id: string;
  cardAdditionalContent?: ComponentType<{ cardId: string }>;
  cardAdditionalActions?: ComponentType<{ cardId: string }>;
  uploadClipboardImage?: (image: string) => Promise<string>;
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
                !editing && onChangeTitle,
              "cursor-grab opacity-30 grayscale": dragging,
              "ring-2 ring-primary-500": editing,
              "cursor-pointer": onClick && !editing,
            },
            className,
          )}
          onDoubleClick={onChangeTitle ? handleDoubleClick : undefined}
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
              <CardAdditionalContent cardId={_id} />
            )}
            {!editing && (
              <Button
                icon
                variant="text"
                size="xs"
                className={clsx(
                  "absolute right-2 top-2 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 group-focus:pointer-events-auto group-focus:opacity-100",
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
      <ContextMenu.Content>
        {CardAdditionalActions && <CardAdditionalActions cardId={_id} />}
        <ContextMenu.Item onClick={handleEdit}>
          Edit {cardName}
        </ContextMenu.Item>
        <ContextMenu.Item onClick={onDelete}>
          Delete {cardName}
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
