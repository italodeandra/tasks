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
  useEffect(() => {
    if (taskGet.data) {
      setTitle(taskGet.data.title || "");
    }
  }, [taskGet.data]);

  const taskUpdate = taskUpdateApi.useMutation();
  const handleChangeTitle = useCallback(
    (value: string) => {
      setTitle(value);
      taskUpdate.mutate({
        _id: taskId,
        description: value,
      });
    },
    [taskId, taskUpdate],
  );

  if (taskGet.isLoading) {
    return <Skeleton className="h-[22px] w-44" />;
  }

  return (
    <MarkdownEditor
      value={title}
      onChange={handleChangeTitle}
      className="-mx-1 -mt-0.5 rounded-md px-1"
      editOnDoubleClick
      editHighlight
    />
  );
}
