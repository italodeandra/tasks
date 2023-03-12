import { useTaskList } from "../../../pages/api/task/list";
import { useCallback } from "react";
import { TaskStatus } from "../../../collections/task";
import { translateTaskStatus } from "./translateTaskStatus";
import { Column } from "./Column";
import Text from "@italodeandra/ui/components/Text/Text";
import Group from "@italodeandra/ui/components/Group/Group";
import { Skeleton } from "@italodeandra/ui/components/Skeleton/Skeleton";
import Stack from "@italodeandra/ui/components/Stack/Stack";
import { useTaskIsBatchUpdatingOrder } from "../../../pages/api/task/batchUpdateOrder";
import Loading from "@italodeandra/ui/components/Loading/Loading";
import { columns } from "./columns.const";
import { useTaskIsUpserting } from "../../../pages/api/task/upsert";
import Alert from "@italodeandra/ui/components/Alert/Alert";
import Button from "@italodeandra/ui/components/Button/Button";

function ColumnTitle({ status }: { status: TaskStatus }) {
  let isBatchUpdatingOrder = useTaskIsBatchUpdatingOrder(status);
  let isUpserting = useTaskIsUpserting();
  let isLoading = isBatchUpdatingOrder || isUpserting;
  return (
    <Text variant="label" className="flex gap-2">
      {translateTaskStatus(status)}
      {isLoading && <Loading />}
    </Text>
  );
}

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
        actions={
          <Button variant="text" onClick={() => refetch()}>
            Try again
          </Button>
        }
      />
    );
  }

  return (
    <Group className="flex-row gap-2 px-4">
      {columns.map((column) => (
        <Stack key={column} className="min-w-[20rem] max-w-[30rem]">
          <ColumnTitle status={column} />
          {isLoading ? (
            <Skeleton className="h-10" />
          ) : (
            <Column
              tasks={renderTasks(column)}
              showAddNewButon={column === TaskStatus.TODO}
              status={column}
            />
          )}
        </Stack>
      ))}
    </Group>
  );
}
