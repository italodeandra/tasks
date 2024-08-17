import { HTMLAttributes, MouseEvent, useCallback, useState } from "react";
import clsx from "@italodeandra/ui/utils/clsx";
import ContextMenu from "@italodeandra/ui/components/ContextMenu";

export function Card({
  title,
  dragging,
  onMouseDown,
  onTouchStart,
  className,
  onDelete,
  ...props
}: {
  title: string;
  dragging?: boolean;
  onDelete?: () => void;
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
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        <div
          className={clsx(
            "rounded-lg bg-zinc-800 px-2.5 py-2 shadow-md outline-0 transition-colors",
            {
              "group-data-[is-dragging=false]/kanban:hover:bg-zinc-700":
                !editing,
            },
            {
              "opacity-30 grayscale": dragging,
              "cursor-pointer": !editing,
              "ring-2 ring-zinc-700 focus:ring-primary-500": editing,
            },
            className,
          )}
          contentEditable={editing}
          {...props}
          onDoubleClick={handleDoubleClick}
          onMouseDown={!editing ? onMouseDown : undefined}
          onTouchStart={!editing ? onTouchStart : undefined}
          onBlur={handleBlur}
          dangerouslySetInnerHTML={{
            __html: title,
          }}
        />
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item onClick={onDelete}>Delete task</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
