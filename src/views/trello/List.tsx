import {
  HTMLAttributes,
  KeyboardEvent,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from "react";
import clsx from "@italodeandra/ui/utils/clsx";
import ContextMenu from "@italodeandra/ui/components/ContextMenu";
import { markdownConverter } from "../../utils/markdownConverter";
import { markdownClassNames } from "./markdown.classNames";

export function List({
  title,
  children,
  dragging,
  className,
  onDelete,
  onChangeTitle,
  _id,
  ...props
}: {
  title: string;
  children: ReactNode;
  dragging?: boolean;
  onDelete?: () => void;
  onChangeTitle?: (title: string) => void;
  _id: string;
} & HTMLAttributes<HTMLDivElement>) {
  const editableRef = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState(false);

  const handleDoubleClick = useCallback(() => {
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
    onChangeTitle?.(editableRef.current!.innerText);
    editableRef.current!.innerHTML = markdownConverter.makeHtml(
      editableRef.current!.innerText,
    );
  }, [onChangeTitle]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape" || (e.key === "Enter" && !e.shiftKey)) {
      e.preventDefault();
      e.currentTarget.blur();
    }
  }, []);

  return (
    <div
      {...props}
      className={clsx(
        "flex flex-col gap-2 rounded-xl bg-zinc-900 p-2",
        {
          "pointer-events-none opacity-30 grayscale": dragging,
        },
        className,
      )}
      data-list-id={_id}
    >
      <ContextMenu.Root>
        <ContextMenu.Trigger asChild>
          <div
            ref={editableRef}
            className={clsx(
              "rounded-md px-1 text-sm font-medium outline-0",
              markdownClassNames,
              {
                "cursor-pointer": !editing,
                "ring-2 ring-zinc-700 focus:ring-primary-500": editing,
              },
            )}
            contentEditable={editing}
            onDoubleClick={handleDoubleClick}
            onBlur={handleBlur}
            dangerouslySetInnerHTML={{
              __html: markdownConverter.makeHtml(title),
            }}
            onKeyDown={handleKeyDown}
            data-is-editing={editing}
          />
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item onClick={onDelete}>Delete list</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>
      {children}
    </div>
  );
}
