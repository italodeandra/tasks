import Tooltip from "@italodeandra/ui/components/Tooltip";
import Button from "@italodeandra/ui/components/Button";
import { PlusIcon } from "@heroicons/react/16/solid";
import React, { useCallback } from "react";
import { TaskStatus } from "../../../collections/task";
import { homeState } from "../home.state";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { taskInsertApi } from "../../../pages/api/task/insert";
import ContextMenu from "@italodeandra/ui/components/ContextMenu";

export function AddTaskButton({ column }: { column: string }) {
  const { mutate: insert, isLoading } = taskInsertApi.useMutation();

  const handleAdd = useCallback(
    (bottom?: boolean) => () => {
      const _id = isomorphicObjectId().toString();
      homeState.setEditingTasks([...homeState.editingTasks, _id]);
      insert({
        _id,
        status: column as TaskStatus,
        projectId:
          homeState.selectedProjects.length === 1
            ? homeState.selectedProjects[0]
            : undefined,
        bottom,
      });
    },
    [column, insert]
  );

  return (
    <Tooltip content="Add new task at the top">
      <span>
        <ContextMenu.Root>
          <ContextMenu.Trigger asChild>
            <Button
              icon
              size="xs"
              variant="text"
              loading={isLoading}
              onClick={handleAdd()}
            >
              <PlusIcon />
            </Button>
          </ContextMenu.Trigger>

          <ContextMenu.Content>
            <ContextMenu.Item onSelect={handleAdd(true)}>
              Add new task at the bottom
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Root>
      </span>
    </Tooltip>
  );
}
