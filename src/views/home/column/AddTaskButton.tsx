import Tooltip from "@italodeandra/ui/components/Tooltip";
import Button from "@italodeandra/ui/components/Button";
import { PlusIcon } from "@heroicons/react/16/solid";
import { useCallback } from "react";
import { TaskStatus } from "../../../collections/task";
import { homeState } from "../home.state";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { taskInsertApi } from "../../../pages/api/task/insert";

export function AddTaskButton({ column }: { column: string }) {
  let { mutate: insert, isLoading } = taskInsertApi.useMutation();

  let handleClick = useCallback(() => {
    let _id = isomorphicObjectId().toString();
    homeState.setEditingTasks([...homeState.editingTasks, _id]);
    insert({
      _id,
      status: column as TaskStatus,
      projectId:
        homeState.selectedProjects.length === 1
          ? homeState.selectedProjects[0]
          : undefined,
    });
  }, [column, insert]);

  return (
    <Tooltip content="Add new task at the top">
      <Button
        icon
        size="xs"
        variant="text"
        loading={isLoading}
        onClick={handleClick}
      >
        <PlusIcon />
      </Button>
    </Tooltip>
  );
}
