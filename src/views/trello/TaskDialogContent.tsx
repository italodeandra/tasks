import { useSnapshot } from "valtio";
import { state } from "./state";
import { useCallback, useMemo } from "react";
import { find } from "lodash-es";
import { MarkdownEditor } from "../../components/Trello/MarkdownEditor";
import clsx from "@italodeandra/ui/utils/clsx";
import Button from "@italodeandra/ui/components/Button";
import { ClockIcon } from "@heroicons/react/24/outline";
import Textarea from "@italodeandra/ui/components/Textarea";
import { PaperAirplaneIcon } from "@heroicons/react/20/solid";

export function TaskDialogContent({
  selected,
}: {
  selected: { cardId: string; listId: string };
}) {
  const { data } = useSnapshot(state);

  const task = useMemo(() => {
    const list = find(data, { _id: selected.listId });
    if (!list) return;
    return find(list.tasks, { _id: selected.cardId });
  }, [data, selected.cardId, selected.listId]);

  const handleDescriptionChange = useCallback(
    (description: string) => {
      const list = find(state.data, { _id: selected.listId });
      if (!list) return;
      const task = find(list.tasks, { _id: selected.cardId });
      if (!task) return;
      task.description = description;
    },
    [selected.cardId, selected.listId],
  );

  return (
    <div className="grid grid-cols-2 gap-2">
      <MarkdownEditor
        value={task?.description || ""}
        onChange={handleDescriptionChange}
        className="-mx-1 rounded-md px-1"
        editOnDoubleClick
        editHighlight
      />
      <div className="flex flex-col gap-4">
        <div
          className={clsx(
            "flex flex-col gap-px",
            "[&>div:first-of-type>div:first-of-type]:rounded-tl [&>div:first-of-type>div:last-of-type]:rounded-tr",
            "[&>div:last-of-type>div:first-of-type]:rounded-bl [&>div:last-of-type>div:last-of-type]:rounded-br",
          )}
        >
          <div className="flex">
            <div className="w-24 bg-white/[0.05] px-2.5 py-2">Status</div>
            <div className="flex-1 rounded-tr bg-white/[0.03] px-2.5 py-2">
              Todo
            </div>
          </div>
          <div className="flex">
            <div className="w-24 bg-white/[0.05] px-2.5 py-2">Project</div>
            <div className="flex-1 bg-white/[0.03] px-2.5 py-2">Tasks</div>
          </div>
          <div className="flex text-xs text-zinc-300">
            <div className="w-24 bg-white/[0.05] px-2.5 py-2">Created at</div>
            <div className="flex-1 bg-white/[0.03] px-2.5 py-2">
              2 minutes ago
            </div>
          </div>
          <div className="flex text-xs text-zinc-300">
            <div className="w-24 bg-white/[0.05] px-2.5 py-2">Updated at</div>
            <div className="flex-1 bg-white/[0.03] px-2.5 py-2">
              2 minutes ago
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">Timesheet</div>
          <div className="flex flex-wrap gap-2">
            <Button icon rounded size="sm">
              <ClockIcon />
            </Button>
            <div className="flex h-[34px] items-center rounded-full bg-white/[0.05]">
              <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-blue-600">
                IA
              </div>
              <div className="pl-2 pr-3">2h</div>
            </div>
            <div className="flex h-[34px] items-center rounded-full bg-white/[0.05]">
              <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-green-600">
                CA
              </div>
              <div className="pl-2 pr-3">3h</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">History</div>
          <div className="flex flex-col gap-2">
            <Textarea
              placeholder="Add new comment"
              trailing={
                <Button
                  icon
                  className="pointer-events-auto"
                  size="sm"
                  variant="text"
                >
                  <PaperAirplaneIcon />
                </Button>
              }
              inputClassName="dark:border-transparent"
              trailingClassName="pr-0.5 items-end pb-0.5"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
