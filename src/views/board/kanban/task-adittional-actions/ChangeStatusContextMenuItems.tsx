import ContextMenu from "@italodeandra/ui/components/ContextMenu";
import { useCallback } from "react";
import { taskGetApi } from "../../../../pages/api/task/get";
import { taskUpdateApi } from "../../../../pages/api/task/update";
import { taskStatusListApi } from "../../../../pages/api/task-status/list";

export function ChangeStatusContextMenuItems({
  boardId,
  taskId,
}: {
  boardId: string;
  taskId: string;
}) {
  const taskStatusList = taskStatusListApi.useQuery({ boardId });
  const taskGet = taskGetApi.useQuery({
    _id: taskId,
  });

  const taskUpdate = taskUpdateApi.useMutation();
  const handleStatusChange = useCallback(
    (statusId: string) => () => {
      taskUpdate.mutate({
        _id: taskId,
        statusId,
      });
    },
    [taskId, taskUpdate],
  );

  return (
    <ContextMenu.Sub>
      <ContextMenu.SubTrigger>Change status to</ContextMenu.SubTrigger>
      <ContextMenu.SubContent>
        {taskStatusList.data?.map((status) => (
          <ContextMenu.CheckboxItem
            checked={status._id === taskGet.data?.statusId}
            disabled={status._id === taskGet.data?.statusId}
            key={status._id}
            onClick={handleStatusChange(status._id)}
          >
            {status.title}
          </ContextMenu.CheckboxItem>
        ))}
      </ContextMenu.SubContent>
    </ContextMenu.Sub>
  );
}
