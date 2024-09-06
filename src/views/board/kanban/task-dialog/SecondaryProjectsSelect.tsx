import { taskUpdateApi } from "../../../../pages/api/task/update";
import { useCallback } from "react";
import Skeleton from "@italodeandra/ui/components/Skeleton";
import { projectListWithSubProjectsApi } from "../../../../pages/api/project/list-with-sub-projects";
import DropdownMenu from "@italodeandra/ui/components/DropdownMenu";
import Button from "@italodeandra/ui/components/Button";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { xor } from "lodash-es";
import clsx from "@italodeandra/ui/utils/clsx";

export function SecondaryProjectsSelect({
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
  value: string[];
  onChange: (value: string[]) => void;
  loading?: boolean;
  canEdit?: boolean;
}) {
  const projectListWithSubProjects = projectListWithSubProjectsApi.useQuery({
    boardId,
  });

  const taskUpdate = taskUpdateApi.useMutation();

  const handleChange = useCallback(
    (value: string[]) => {
      taskUpdate.mutate({
        _id: taskId,
        secondaryProjectsIds: value,
      });
      onChange(value);
    },
    [onChange, taskId, taskUpdate],
  );

  if (projectListWithSubProjects.isLoading || loading) {
    return <Skeleton className="h-5 w-16" />;
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="text"
          className={clsx("-m-1.5 px-1.5 py-1 text-left font-normal", {
            "text-zinc-500": !value.length,
          })}
          loading={taskUpdate.isPending}
          readOnly={!canEdit}
          trailing={<ChevronDownIcon />}
        >
          {value.length && projectListWithSubProjects.data
            ? projectListWithSubProjects.data
                .map((project) =>
                  value.includes(project._id) ? project.name : null,
                )
                .filter(Boolean)
                .join(", ")
            : "None"}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={() => handleChange([])}>
          None
        </DropdownMenu.Item>
        {projectListWithSubProjects.data
          ?.filter((project) => project._id !== projectId)
          .map((project) => (
            <DropdownMenu.CheckboxItem
              key={project._id}
              checked={value.includes(project._id)}
              onClick={() => handleChange(xor(value, [project._id]))}
            >
              {project.name}
            </DropdownMenu.CheckboxItem>
          ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
