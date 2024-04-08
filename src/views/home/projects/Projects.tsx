import { useProjectList } from "../../../pages/api/project/list";
import React, { useMemo } from "react";
import { ProjectColor } from "../../../collections/project";
import Button from "@italodeandra/ui/components/Button";
import DropdownMenu from "@italodeandra/ui/components/DropdownMenu";
import { useSnapshot } from "valtio";
import { homeState } from "../home.state";
import { pull } from "lodash";

export default function Projects() {
  const { selectedProjects, setSelectedProjects } = useSnapshot(homeState);
  const { data: projects, isLoading: isLoading } = useProjectList();

  const projectsWithNone = useMemo(
    () => [
      {
        _id: "NONE",
        name: "None",
        lastTaskUpdatedAt: "",
        color: ProjectColor.BLUE,
      },
      ...(projects || []),
    ],
    [projects]
  );

  const selectedProjectsNames = useMemo(
    () =>
      projectsWithNone
        .filter((p) => selectedProjects.includes(p._id))
        .map((p) => p.name),
    [projectsWithNone, selectedProjects]
  );

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button size="xs" loading={isLoading}>
          {selectedProjects.length === 0 ||
          selectedProjects.length === projectsWithNone.length
            ? "All projects"
            : `Project${
                selectedProjectsNames.length === 1 ? "" : "s"
              }: ${selectedProjectsNames.join(", ")}`}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.CheckboxItem
          checked={selectedProjects.length === projectsWithNone.length}
          onClick={() => setSelectedProjects([])}
        >
          All
        </DropdownMenu.CheckboxItem>
        {projectsWithNone.map((project) => (
          <DropdownMenu.CheckboxItem
            key={project._id}
            checked={selectedProjects.includes(project._id)}
            onCheckedChange={(checked) =>
              setSelectedProjects(
                checked
                  ? [...selectedProjects, project._id]
                  : pull([...selectedProjects], project._id)
              )
            }
          >
            {project.name}
          </DropdownMenu.CheckboxItem>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
