import ContextMenu from "@italodeandra/ui/components/ContextMenu";
import {
  TaskStatusListApi,
  taskStatusListApi,
} from "../../../pages/api/task-status/list";
import { taskColumnListApi } from "../../../pages/api/task-column/list";
import { useCallback, useMemo } from "react";
import { taskColumnUpdateApi } from "../../../pages/api/task-column/update";
import Loading from "@italodeandra/ui/components/Loading";

export function ColumnAdditionalActions({
  listId,
  boardId,
  canEdit,
}: {
  listId: string;
  boardId: string;
  canEdit?: boolean;
}) {
  const taskStatusList = taskStatusListApi.useQuery({
    boardId,
  });

  const taskColumnList = taskColumnListApi.useQuery({
    boardId,
  });

  const taskColumn = useMemo(
    () => taskColumnList.data?.find((column) => column._id === listId),
    [listId, taskColumnList.data],
  );

  const taskColumnUpdate = taskColumnUpdateApi.useMutation();

  const handleLinkedStatusChange = useCallback(
    (status: TaskStatusListApi["Response"][0]) => () => {
      taskColumnUpdate.mutate({
        _id: listId,
        linkedStatusId: status._id,
      });
    },
    [listId, taskColumnUpdate],
  );

  return canEdit ? (
    <ContextMenu.Sub>
      <ContextMenu.SubTrigger>
        Link to status
        {(taskColumnUpdate.isPending || taskStatusList.isLoading) && (
          <Loading />
        )}
      </ContextMenu.SubTrigger>
      <ContextMenu.SubContent>
        {taskStatusList.data?.map((status) => (
          <ContextMenu.CheckboxItem
            key={status._id}
            checked={taskColumn?.linkedStatusId === status._id}
            onClick={handleLinkedStatusChange(status)}
          >
            {status.title}
          </ContextMenu.CheckboxItem>
        ))}
      </ContextMenu.SubContent>
    </ContextMenu.Sub>
  ) : null;
}
