import ContextMenu from "@italodeandra/ui/components/ContextMenu";
import {
  TaskStatusListApi,
  taskStatusListApi,
} from "../../../pages/api/task-status/list";
import { taskColumnListApi } from "../../../pages/api/task-column/list";
import { useCallback, useMemo } from "react";
import { taskColumnUpdateApi } from "../../../pages/api/task-column/update";
import Loading from "@italodeandra/ui/components/Loading";
import { taskBatchUpdateApi } from "../../../pages/api/task/batch-update";
import { boardState } from "../board.state";
import { taskListApi } from "../../../pages/api/task/list";
import { useSnapshot } from "valtio";

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

  const { selectedProjects, selectedSubProjects } = useSnapshot(boardState);
  const taskList = taskListApi.useQuery({
    boardId,
    selectedProjects: selectedProjects as string[],
    selectedSubProjects: selectedSubProjects as string[],
  });
  const taskBatchUpdate = taskBatchUpdateApi.useMutation();
  const handleArchive = useCallback(
    (status: TaskStatusListApi["Response"][0]) => () => {
      const instructions = taskList.data
        ?.find((task) => task._id === listId)
        ?.tasks?.filter((task) => task.status?._id === status._id)
        .map((task) => ({
          type: "taskRemoved" as const,
          taskId: task._id,
        }));
      if (instructions?.length) {
        taskBatchUpdate.mutate({
          boardId,
          instructions,
          selectedProjects: selectedProjects as string[],
          selectedSubProjects: selectedSubProjects as string[],
        });
      }
    },
    [
      boardId,
      listId,
      selectedProjects,
      selectedSubProjects,
      taskBatchUpdate,
      taskList.data,
    ],
  );

  return canEdit ? (
    <>
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
      <ContextMenu.Sub>
        <ContextMenu.SubTrigger>
          Archive tasks with status
        </ContextMenu.SubTrigger>
        <ContextMenu.SubContent>
          {taskStatusList.data?.map((status) => (
            <ContextMenu.Item key={status._id} onClick={handleArchive(status)}>
              {status.title}
            </ContextMenu.Item>
          ))}
        </ContextMenu.SubContent>
      </ContextMenu.Sub>
    </>
  ) : null;
}
