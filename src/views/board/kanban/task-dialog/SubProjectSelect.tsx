import { taskUpdateApi } from "../../../../pages/api/task/update";
import { useCallback, useMemo } from "react";
import Skeleton from "@italodeandra/ui/components/Skeleton";
import Select from "@italodeandra/ui/components/Select";
import { projectListWithSubProjectsApi } from "../../../../pages/api/project/list-with-sub-projects";

export function SubProjectSelect({
  projectId,
  taskId,
  boardId,
  value,
  onChange,
  loading,
  canEdit,
}: {
  projectId: string;
  taskId: string;
  boardId: string;
  value: string;
  onChange: (value: string) => void;
  loading?: boolean;
  canEdit?: boolean;
}) {
  const projectListWithSubProjects = projectListWithSubProjectsApi.useQuery(
    {
      boardId,
    },
    {
      enabled: false,
    },
  );

  const subProjects = useMemo(
    () =>
      projectListWithSubProjects.data?.find(
        (project) => project._id === projectId,
      )?.subProjects,
    [projectId, projectListWithSubProjects.data],
  );

  const taskUpdate = taskUpdateApi.useMutation();

  const handleChange = useCallback(
    (value: string) => {
      taskUpdate.mutate({
        _id: taskId,
        subProjectId: value,
      });
      onChange(value);
    },
    [onChange, taskId, taskUpdate],
  );

  if (projectListWithSubProjects.isLoading || loading) {
    return <Skeleton className="h-5 w-16" />;
  }

  return (
    <Select.Root value={value} onValueChange={handleChange}>
      <Select.Trigger
        placeholder="None"
        variant="text"
        className="-m-1.5 px-1.5 py-1 text-left font-normal data-[placeholder]:text-zinc-500"
        loading={taskUpdate.isPending}
        readOnly={!canEdit}
      />
      <Select.Content>
        <Select.Item value="__NONE__">None</Select.Item>
        {subProjects?.map((subProject) => (
          <Select.Item key={subProject._id} value={subProject._id}>
            {subProject.name}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
