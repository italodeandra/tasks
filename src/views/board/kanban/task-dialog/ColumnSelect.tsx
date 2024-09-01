import { taskUpdateApi } from "../../../../pages/api/task/update";
import { useCallback } from "react";
import Skeleton from "@italodeandra/ui/components/Skeleton";
import Select from "@italodeandra/ui/components/Select";
import { taskColumnListApi } from "../../../../pages/api/task-column/list";

export function ColumnSelect({
  taskId,
  boardId,
  value,
  onChange,
  loading,
  canEdit,
}: {
  taskId: string;
  boardId: string;
  value: string;
  onChange: (value: string) => void;
  loading?: boolean;
  canEdit?: boolean;
}) {
  const taskColumnList = taskColumnListApi.useQuery({ boardId });

  const taskUpdate = taskUpdateApi.useMutation();

  const handleChange = useCallback(
    (value: string) => {
      taskUpdate.mutate({
        _id: taskId,
        columnId: value,
      });
      onChange(value);
    },
    [onChange, taskId, taskUpdate],
  );

  if (taskColumnList.isLoading || loading) {
    return <Skeleton className="h-5 w-16" />;
  }

  return (
    <Select.Root value={value} onValueChange={handleChange}>
      <Select.Trigger
        placeholder="None"
        variant="text"
        className="-m-1.5 px-1.5 py-1 font-normal data-[placeholder]:text-zinc-500"
        loading={taskUpdate.isPending}
        readOnly={!canEdit}
      />
      <Select.Content>
        {taskColumnList.data?.map((column) => (
          <Select.Item key={column._id} value={column._id}>
            {column.title}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
