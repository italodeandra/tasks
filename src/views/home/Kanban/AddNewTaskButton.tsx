import { TaskStatus } from "../../../collections/task";
import { useTaskUpsert } from "../../../pages/api/task/upsert";
import React, { useCallback } from "react";
import Button from "@italodeandra/ui/components/Button/Button";
import { PlusIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

export function AddNewTaskButton({
  status,
  selectedProjects,
  order,
  className,
}: {
  status: TaskStatus;
  selectedProjects: string[];
  order?: number;
  className?: string;
}) {
  let { mutate: upsert, isLoading } = useTaskUpsert();

  let handleAddNewClick = useCallback(() => {
    let newTask = {
      content: "",
      status,
      projectId:
        selectedProjects.length === 1 ? selectedProjects[0] : undefined,
      order,
    };
    upsert(newTask);
  }, [order, selectedProjects, status, upsert]);

  return (
    <Button
      className={clsx("opacity-50 transition-all hover:opacity-100", className)}
      leadingIcon={<PlusIcon />}
      onClick={handleAddNewClick}
      loading={isLoading}
    >
      New task
    </Button>
  );
}
