import { taskUpdateApi } from "../../../../pages/api/task/update";
import { useCallback } from "react";
import Skeleton from "@italodeandra/ui/components/Skeleton";
import Select from "@italodeandra/ui/components/Select";
import { projectListWithSubProjectsApi } from "../../../../pages/api/project/list-with-sub-projects";

export function ProjectSelect({
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
  const projectListWithSubProjects = projectListWithSubProjectsApi.useQuery({
    boardId,
  });

  const taskUpdate = taskUpdateApi.useMutation();

  const handleChange = useCallback(
    (value: string) => {
      taskUpdate.mutate({
        _id: taskId,
        projectId: value,
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
        className="-m-1.5 px-1.5 py-1 font-normal data-[placeholder]:text-zinc-500"
        loading={taskUpdate.isPending}
      />
      <Select.Content>
        <Select.Item value="__NONE__">None</Select.Item>
        {projectListWithSubProjects.data?.map((project) => (
          <Select.Item key={project._id} value={project._id}>
            {project.name}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
