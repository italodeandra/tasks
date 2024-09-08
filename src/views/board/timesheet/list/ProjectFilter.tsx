import { projectListWithSubProjectsApi } from "../../../../pages/api/project/list-with-sub-projects";
import { useCallback } from "react";
import DropdownMenu from "@italodeandra/ui/components/DropdownMenu";
import Button from "@italodeandra/ui/components/Button";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import Skeleton from "@italodeandra/ui/components/Skeleton";

export function ProjectFilter({
  boardId,
  selected,
  setSelected,
}: {
  boardId: string;
  selected: string[];
  setSelected: (selected: string[]) => void;
}) {
  const projectListWithSubProjects = projectListWithSubProjectsApi.useQuery({
    boardId,
  });

  const getProjectName = useCallback(
    (projectId: string) =>
      projectListWithSubProjects.data?.find(
        (project) => project._id === projectId,
      )?.name || projectId,
    [projectListWithSubProjects.data],
  );

  if (projectListWithSubProjects.isLoading) {
    return <Skeleton className="h-[38px] w-[104px]" />;
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="light"
          color={selected.length ? "primary" : "gray"}
          trailing={<ChevronDownIcon />}
        >
          {!selected.length
            ? "Projects"
            : selected.map(getProjectName).join(", ")}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={() => setSelected([])}>
          All projects
        </DropdownMenu.Item>
        {projectListWithSubProjects.data?.map((project) => (
          <DropdownMenu.CheckboxItem
            key={project._id}
            checked={selected.includes(project._id)}
            onCheckedChange={(checked) => {
              setSelected(
                checked
                  ? [...selected, project._id]
                  : selected.filter((id) => id !== project._id),
              );
            }}
          >
            {project.name}
          </DropdownMenu.CheckboxItem>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
