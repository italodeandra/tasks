import Tooltip from "@italodeandra/ui/components/Tooltip";
import Button from "@italodeandra/ui/components/Button";
import { PlusIcon } from "@heroicons/react/16/solid";
import { useTaskInsert } from "../../../pages/api/task/insert";
import { useCallback } from "react";
import { TaskStatus } from "../../../collections/task";

export function AddTaskButton({ column }: { column: string }) {
  let { mutate: insert, isLoading } = useTaskInsert();

  let handleClick = useCallback(() => {
    insert({
      status: column as TaskStatus,
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
