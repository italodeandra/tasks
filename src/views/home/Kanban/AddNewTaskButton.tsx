import { TaskStatus } from "../../../collections/task";
import { useTaskUpsert } from "../../../pages/api/task/upsert";
import React, { useCallback } from "react";
import Button from "@italodeandra/ui/components/Button/Button";
import { PlusIcon } from "@heroicons/react/20/solid";

export function AddNewTaskButton({
  status,
  selectedProjects,
}: {
  status: TaskStatus;
  selectedProjects: string[];
}) {
  let { mutate: upsert, isLoading } = useTaskUpsert();

  let handleAddNewClick = useCallback(() => {
    let newTask = {
      content: "",
      status,
      projectId:
        selectedProjects.length === 1 ? selectedProjects[0] : undefined,
    };
    upsert(newTask);
  }, [selectedProjects, status, upsert]);

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
