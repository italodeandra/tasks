import { TaskStatus } from "../../../collections/task";
import { useTaskUpsert } from "../../../pages/api/task/upsert";
import React, { useCallback } from "react";
import Button from "@italodeandra/ui/components/Button/Button";
import { PlusIcon } from "@heroicons/react/20/solid";

export function AddNewTaskButton({ status }: { status: TaskStatus }) {
  let { mutate: upsert, isLoading } = useTaskUpsert();

  let handleAddNewClick = useCallback(() => {
    let newTask = {
      content: "",
      status,
    };
    upsert(newTask);
  }, [status, upsert]);

  return (
    <Button
      leadingIcon={<PlusIcon />}
      onClick={handleAddNewClick}
      loading={isLoading}
    >
      New task
    </Button>
  );
}
