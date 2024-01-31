import Tooltip from "@italodeandra/ui/components/Tooltip";
import Button from "@italodeandra/ui/components/Button";
import { PlusIcon } from "@heroicons/react/16/solid";
import { useCallback } from "react";
import { TaskStatus } from "../../../collections/task";
import { homeState } from "../home.state";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { taskGetApi } from "../../../pages/api/task/get";

export function AddTaskButton({ column }: { column: string }) {
  let { mutate: insert, isLoading } = taskGetApi.useMutation();

  let handleClick = useCallback(() => {
    insert({
      _id: isomorphicObjectId().toString(),
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
        className="-mt-1"
        loading={isLoading}
        onClick={handleClick}
      >
        <PlusIcon />
      </Button>
    </Tooltip>
  );
}
