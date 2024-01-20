import { TaskStatus } from "../../../collections/task";
import { useTaskUpsert } from "../../../pages/api/task/upsert";
import React, { useCallback } from "react";
import Button from "@italodeandra/ui/components/Button/Button";
import { PlusIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useSnapshot } from "valtio";
import { state } from "./state";

export function AddNewTaskButton({
  status,
  order,
  className,
}: {
  status: TaskStatus;
  order?: number;
  className?: string;
}) {
  let { selectedProjects } = useSnapshot(state);
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
      leading={<PlusIcon />}
      onClick={handleAddNewClick}
      loading={isLoading}
    >
      New task
    </Button>
  );
}
