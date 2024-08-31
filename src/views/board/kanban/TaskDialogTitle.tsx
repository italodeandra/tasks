import { useSnapshot } from "valtio";
import { kanbanState } from "./kanban.state";
import { useMemo } from "react";
import { find } from "lodash-es";
import { MarkdownEditor } from "../../../components/Kanban/MarkdownEditor";

export function TaskDialogTitle({
  selected,
}: {
  selected: { cardId: string; listId: string };
}) {
  const { data } = useSnapshot(kanbanState);

  const task = useMemo(() => {
    const list = find(data, { _id: selected.listId });
    if (!list) return;
    return find(list.tasks, { _id: selected.cardId });
  }, [data, selected.cardId, selected.listId]);

  const handleTitleChange = (title: string) => {
    const list = find(kanbanState.data, { _id: selected.listId });
    if (!list) return;
    const task = find(list.tasks, { _id: selected.cardId });
    if (!task) return;
    task.title = title;
  };

  return (
    <MarkdownEditor
      value={task?.title || ""}
      onChange={handleTitleChange}
      className="-mx-1 -mt-0.5 rounded-md px-1"
      editOnDoubleClick
      editHighlight
    />
  );
}
