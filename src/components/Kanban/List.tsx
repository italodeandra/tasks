import { HTMLAttributes, ReactNode } from "react";
import clsx from "@italodeandra/ui/utils/clsx";
import ContextMenu from "@italodeandra/ui/components/ContextMenu";
import { MarkdownEditor } from "./MarkdownEditor";

export function List({
  title,
  children,
  dragging,
  className,
  onDelete,
  onChangeTitle,
  _id,
  canEdit,
  ...props
}: {
  title: string;
  children: ReactNode;
  dragging?: boolean;
  onDelete?: () => void;
  onChangeTitle?: (title: string) => void;
  _id: string;
  canEdit?: boolean;
} & HTMLAttributes<HTMLDivElement>) {
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
          <MarkdownEditor
            value={title}
            onChange={canEdit ? onChangeTitle : undefined}
            className="rounded-md px-1 text-sm font-medium outline-0"
            editOnDoubleClick
            editHighlight
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
