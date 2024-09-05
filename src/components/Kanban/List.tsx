import { ComponentType, HTMLAttributes, ReactNode } from "react";
import clsx from "@italodeandra/ui/utils/clsx";
import ContextMenu from "@italodeandra/ui/components/ContextMenu";
import { MarkdownEditor } from "./MarkdownEditor";
import Sticky from "react-stickynode";

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
        "rounded-xl bg-zinc-900",
        {
          "pointer-events-none opacity-30 grayscale": dragging,
        },
        className,
      )}
      data-list-id={_id}
    >
      <ContextMenu.Root>
        <ContextMenu.Trigger asChild>
          <Sticky enabled={true} top="#header" innerZ={1}>
            <div className="relative z-30 rounded-xl bg-zinc-900 p-2 transition-all scrolled:rounded-t-none">
              <MarkdownEditor
                value={title}
                onChange={canEdit ? onChangeTitle : undefined}
                className="rounded-md px-1 text-sm font-medium outline-0"
                editOnDoubleClick
                editHighlight
              />
            </div>
          </Sticky>
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
      <div className="flex flex-col gap-2 p-2">{children}</div>
    </div>
  );
}
