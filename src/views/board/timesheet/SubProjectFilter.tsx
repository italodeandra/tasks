import { projectListWithSubProjectsApi } from "../../../pages/api/project/list-with-sub-projects";
import { useCallback, useEffect, useMemo } from "react";
import DropdownMenu from "@italodeandra/ui/components/DropdownMenu";
import Button from "@italodeandra/ui/components/Button";
import { ChevronDownIcon } from "@heroicons/react/16/solid";

export function SubProjectFilter({
  boardId,
  projectsIds,
  selected,
  setSelected,
}: {
  boardId: string;
  projectsIds: string[];
  selected: string[];
  setSelected: (selected: string[]) => void;
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
      projectListWithSubProjects.data?.flatMap((project) =>
        projectsIds.includes(project._id) ? project.subProjects : [],
      ),
    [projectsIds, projectListWithSubProjects.data],
  );

  const getSubProjectName = useCallback(
    (subProjectId: string) =>
      subProjects?.find((subProject) => subProject._id === subProjectId)
        ?.name || subProjectId,
    [subProjects],
  );

  useEffect(() => {
    // clear selected subprojects if the selected projects are not in the list
    setSelected(
      selected.filter((subProjectId) =>
        subProjects?.some((subProject) => subProject._id === subProjectId),
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subProjects]);

  if (!subProjects?.length) {
    return null;
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
            ? "Sub-projects"
            : selected.map(getSubProjectName).join(", ")}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={() => setSelected([])}>
          All sub-projects
        </DropdownMenu.Item>
        {subProjects?.map((subProject) => (
          <DropdownMenu.CheckboxItem
            key={subProject._id}
            checked={selected.includes(subProject._id)}
            onCheckedChange={(checked) => {
              setSelected(
                checked
                  ? [...selected, subProject._id]
                  : selected.filter((id) => id !== subProject._id),
              );
            }}
          >
            {subProject.name}
          </DropdownMenu.CheckboxItem>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
