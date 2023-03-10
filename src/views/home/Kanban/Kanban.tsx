import { useTaskList } from "../../../pages/api/task/list";
import { useCallback } from "react";
import { TaskStatus } from "../../../collections/task";
import Alert from "../../../components/Alert/Alert";
import { AlertButton } from "../../../components/Alert/AlertButton";
import { translateTaskStatus } from "./translateTaskStatus";
import { Column, columns } from "./Column";
import Text from "@italodeandra/ui/components/Text/Text";
import Group from "@italodeandra/ui/components/Group/Group";
import { Skeleton } from "@italodeandra/ui/components/Skeleton/Skeleton";
import Stack from "@italodeandra/ui/components/Stack/Stack";

export function Kanban() {
  let { data: tasks, isError, isLoading, refetch } = useTaskList();

  let renderTasks = useCallback(
    (status: TaskStatus) => tasks?.filter((t) => t.status === status) || [],
    [tasks]
  );

  if (isError) {
    return (
      <Alert
        title="It was not possible to load the tasks"
        variant="error"
        actions={<AlertButton onClick={() => refetch()}>Try again</AlertButton>}
      />
    );
  }

  return (
    <Group className="sm:flex-row sm:gap-2">
      {columns.map((column) => (
        <Stack key={column} className="w-full max-w-full sm:w-80">
          <Text variant="label">{translateTaskStatus(column)}</Text>
          {isLoading ? (
            <Skeleton className="h-10" />
          ) : (
            <Column
              tasks={renderTasks(column)}
              showAddNewButon={column === TaskStatus.TODO}
            />
          )}
        </Stack>
      ))}
    </Group>
  );
}
