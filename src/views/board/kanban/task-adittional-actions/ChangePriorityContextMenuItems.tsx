import ContextMenu from "@italodeandra/ui/components/ContextMenu";
import { useCallback } from "react";
import { taskGetApi } from "../../../../pages/api/task/get";
import { taskUpdateApi } from "../../../../pages/api/task/update";

export function ChangePriorityContextMenuItems({ taskId }: { taskId: string }) {
  const taskGet = taskGetApi.useQuery({
    _id: taskId,
  });

  const taskUpdate = taskUpdateApi.useMutation();
  const handlePriorityChange = useCallback(
    (update: 1 | -1) => () => {
      if (taskGet.data) {
        let newPriority: number | undefined =
          (taskGet.data.priority || 0) + update;
        newPriority = newPriority >= 0 ? newPriority : 0;
        taskUpdate.mutate({
          _id: taskId,
          priority: newPriority,
        });
      }
    },
    [taskGet.data, taskId, taskUpdate],
  );

  return (
    <>
      <ContextMenu.Item onClick={handlePriorityChange(1)}>
        Increase priority
      </ContextMenu.Item>
      <ContextMenu.Item
        onClick={handlePriorityChange(-1)}
        disabled={!(Number(taskGet.data?.priority) > 0)}
      >
        Decrease priority
      </ContextMenu.Item>
    </>
  );
}
