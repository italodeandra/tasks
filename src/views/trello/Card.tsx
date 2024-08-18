import {
  FocusEvent,
  HTMLAttributes,
  KeyboardEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import clsx from "@italodeandra/ui/utils/clsx";
import ContextMenu from "@italodeandra/ui/components/ContextMenu";
import Button from "@italodeandra/ui/components/Button";
import { PencilIcon } from "@heroicons/react/24/solid";
import { isTouchDevice } from "@italodeandra/ui/utils/isBrowser";

export function Card({
  title,
  dragging,
  className,
  onDelete,
  onChangeTitle,
  _id,
  ...props
}: {
  title: string;
  dragging?: boolean;
  onDelete?: () => void;
  onChangeTitle?: (title: string) => void;
  _id: string;
} & HTMLAttributes<HTMLDivElement>) {
  const editableRef = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState(false);

  const handleEdit = useCallback(() => {
    setEditing(true);
    setTimeout(() => {
      if (editableRef.current) {
        editableRef.current.focus();
        const range = document.createRange();
        range.selectNodeContents(editableRef.current);
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    });
  }, []);

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLDivElement>) => {
      setEditing(false);
      window.getSelection()?.removeAllRanges();
      setTimeout(() => {
        editableRef.current?.parentElement?.focus();
      });
      onChangeTitle?.(e.currentTarget.innerHTML);
    },
    [onChangeTitle],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (
        editing &&
        (e.key === "Escape" ||
          (e.key === "Enter" && !e.shiftKey && !isTouchDevice))
      ) {
        e.preventDefault();
        e.currentTarget.blur();
      }
      if (!editing && e.key === "Enter") {
        handleEdit();
      }
    },
    [editing, handleEdit],
  );

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        <div
          {...props}
          className={clsx(
            "group rounded-lg bg-zinc-800 shadow-md outline-none transition-colors",
            "ring-zinc-700 focus:ring-2 focus:ring-primary-800",
            {
              "group-data-[is-dragging=false]/kanban:hover:bg-zinc-700":
                !editing && onChangeTitle,
            },
            {
              "opacity-30 grayscale": dragging,
              "ring-2 ring-primary-500": editing,
            },
            className,
          )}
          onDoubleClick={onChangeTitle ? handleEdit : undefined}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          data-card-id={_id}
        >
          <div className="pointer-events-none relative">
            <div
              ref={editableRef}
              dangerouslySetInnerHTML={{
                __html: title,
              }}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              contentEditable={editing}
              className={clsx("px-2.5 py-2 outline-none", {
                "pointer-events-auto": editing,
                "cursor-pointer": !editing && onChangeTitle,
              })}
              data-is-editing={editing}
            />
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
              >
                <PencilIcon className="pointer-events-none" />
              </Button>
            )}
          </div>
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item onClick={handleEdit}>Edit task</ContextMenu.Item>
        <ContextMenu.Item onClick={onDelete}>Delete task</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
