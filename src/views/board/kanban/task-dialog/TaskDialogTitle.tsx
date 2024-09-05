import { useCallback, useEffect, useState } from "react";
import { MarkdownEditor } from "../../../../components/Kanban/MarkdownEditor";
import { taskGetApi } from "../../../../pages/api/task/get";
import { taskUpdateApi } from "../../../../pages/api/task/update";
import Skeleton from "@italodeandra/ui/components/Skeleton";

export function TaskDialogTitle({ taskId }: { taskId: string }) {
  const [title, setTitle] = useState("");

  const taskGet = taskGetApi.useQuery({
    _id: taskId,
  });
  const task = taskGet.data;
  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
    }
  }, [task]);

  const taskUpdate = taskUpdateApi.useMutation();
  const handleChangeTitle = useCallback(
    (value: string) => {
      if (title !== value) {
        setTitle(value);
        taskUpdate.mutate({
          _id: taskId,
          title: value,
        });
      }
    },
    [taskId, taskUpdate, title],
  );

  if (taskGet.isLoading) {
    return <Skeleton className="h-[22px] w-44" />;
  }

  return (
    <MarkdownEditor
      value={title}
      onChange={task?.canEdit ? handleChangeTitle : undefined}
      className="-mx-1 -mt-0.5 rounded-md px-1"
      editOnDoubleClick={task?.canEdit}
      editHighlight
      placeholder="No title"
    />
  );
}
