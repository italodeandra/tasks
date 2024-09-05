import { ComponentType, HTMLAttributes, ReactNode } from "react";
import clsx from "@italodeandra/ui/utils/clsx";
import ContextMenu from "@italodeandra/ui/components/ContextMenu";
import { MarkdownEditor } from "./MarkdownEditor";

export function List<AP extends Record<string, unknown>>({
  title,
  children,
  dragging,
  className,
  onDelete,
  onChangeTitle,
  _id,
  canEdit,
  listName,
  additionalActions: AdditionalActions,
  additionalProps,
  ...props
}: {
  title: string;
  children: ReactNode;
  dragging?: boolean;
  onDelete?: () => void;
  onChangeTitle?: (title: string) => void;
  _id: string;
  canEdit?: boolean;
  listName?: string;
  additionalActions?: ComponentType<{ listId: string } & AP>;
  additionalProps?: AP;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={clsx(
        "flex min-w-40 flex-col gap-2 rounded-xl bg-zinc-900 p-2",
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
        {canEdit && (
          <ContextMenu.Content>
            {AdditionalActions && (
              <AdditionalActions listId={_id} {...(additionalProps as AP)} />
            )}
            <ContextMenu.Item onClick={onDelete}>
              Delete {listName}
            </ContextMenu.Item>
          </ContextMenu.Content>
        )}
      </ContextMenu.Root>
      {children}
    </div>
  );
}
