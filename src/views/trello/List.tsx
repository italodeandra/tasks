import {
  FocusEvent,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  useCallback,
  useState,
} from "react";
import clsx from "@italodeandra/ui/utils/clsx";
import ContextMenu from "@italodeandra/ui/components/ContextMenu";

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
  const [editing, setEditing] = useState(false);

  const handleDoubleClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    setEditing(true);
    const target = e.currentTarget;
    setTimeout(() => {
      target.focus();
      const range = document.createRange();
      range.selectNodeContents(target);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    });
  }, []);

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLDivElement>) => {
      setEditing(false);
      onChangeTitle?.(e.currentTarget.innerHTML);
    },
    [onChangeTitle],
  );

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
            className={clsx("rounded-md px-1 text-sm font-medium outline-0", {
              "cursor-pointer": !editing,
              "ring-2 ring-zinc-700 focus:ring-primary-500": editing,
            })}
            contentEditable={editing}
            onDoubleClick={handleDoubleClick}
            onBlur={handleBlur}
            dangerouslySetInnerHTML={{
              __html: title,
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
