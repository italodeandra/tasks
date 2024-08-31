import { taskStatusListApi } from "../../../../pages/api/task-status/list";
import { taskUpdateApi } from "../../../../pages/api/task/update";
import { useCallback } from "react";
import Skeleton from "@italodeandra/ui/components/Skeleton";
import Select from "@italodeandra/ui/components/Select";

export function StatusSelect({
  taskId,
  boardId,
  value,
  onChange,
  loading,
}: {
  taskId: string;
  boardId: string;
  value: string;
  onChange: (value: string) => void;
  loading?: boolean;
}) {
  const taskStatusList = taskStatusListApi.useQuery({ boardId });

  const taskUpdate = taskUpdateApi.useMutation();

  const handleChange = useCallback(
    (value: string) => {
      taskUpdate.mutate({
        _id: taskId,
        statusId: value,
      });
      onChange(value);
    },
    [onChange, taskId, taskUpdate],
  );

  if (taskStatusList.isLoading || loading) {
    return <Skeleton className="h-5 w-16" />;
  }

  return (
    <Select.Root value={value} onValueChange={handleChange}>
      <Select.Trigger
        placeholder="None"
        variant="text"
        className="-m-1.5 px-1.5 py-1 font-normal data-[placeholder]:text-zinc-500"
        loading={taskUpdate.isPending}
      />
      <Select.Content>
        {taskStatusList.data?.map((status) => (
          <Select.Item key={status._id} value={status._id}>
            {status.title}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
