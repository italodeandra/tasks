import {
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
  ...props
}: {
  title: string;
  children: ReactNode;
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

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape" || (e.key === "Enter" && !e.shiftKey)) {
      e.preventDefault();
      e.currentTarget.blur();
    }
  }, []);

  return (
    <div
      className={clsx(
        "flex flex-col gap-2 rounded-xl bg-zinc-900 p-2",
        {
          "pointer-events-none opacity-30 grayscale": dragging,
        },
        className,
      )}
      {...props}
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
