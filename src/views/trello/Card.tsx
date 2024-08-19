import {
  HTMLAttributes,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import clsx from "@italodeandra/ui/utils/clsx";
import ContextMenu from "@italodeandra/ui/components/ContextMenu";
import Button from "@italodeandra/ui/components/Button";
import { PencilIcon } from "@heroicons/react/24/solid";
import { isTouchDevice } from "@italodeandra/ui/utils/isBrowser";
import { markdownConverter } from "../../utils/markdownConverter";
import { markdownClassNames } from "./markdown.classNames";
import stopPropagation from "@italodeandra/ui/utils/stopPropagation";

export function Card({
  title,
  dragging,
  className,
  onDelete,
  onChangeTitle,
  onClick,
  _id,
  ...props
}: {
  title: string;
  dragging?: boolean;
  onDelete?: () => void;
  onChangeTitle?: (title: string) => void;
  onClick?: () => void;
  _id: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "onClick">) {
  const editableRef = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState(false);
  const clickTimeout = useRef(0);

  const handleEdit = useCallback(() => {
    setEditing(true);
    editableRef.current!.innerText = title;
    const target = editableRef.current;
    setTimeout(() => {
      if (target) {
        target.focus();
        const range = document.createRange();
        range.selectNodeContents(target);
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    });
  }, [title]);

  const handleBlur = useCallback(() => {
    setEditing(false);
    window.getSelection()?.removeAllRanges();
    setTimeout(() => {
      editableRef.current!.parentElement?.focus();
    });
    const newTitle = editableRef.current!.innerText;
    onChangeTitle?.(newTitle);
    editableRef.current!.innerHTML = markdownConverter.makeHtml(
      newTitle.replaceAll(" ", ""),
    );
  }, [onChangeTitle]);

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
          onMouseDown={!editing ? handleClick : undefined}
          onTouchStart={!editing ? handleClick : undefined}
        >
          <div className="pointer-events-none relative">
            <div
              ref={editableRef}
              dangerouslySetInnerHTML={{
                __html: markdownConverter.makeHtml(title.replaceAll(" ", "")),
              }}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              contentEditable={editing}
              className={clsx("p-3 outline-none", markdownClassNames, {
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
        <ContextMenu.Item onClick={handleEdit}>Edit task</ContextMenu.Item>
        <ContextMenu.Item onClick={onDelete}>Delete task</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
