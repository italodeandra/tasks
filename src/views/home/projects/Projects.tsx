import { useProjectList } from "../../../pages/api/project/list";
import React, { useMemo } from "react";
import { ProjectColor } from "../../../collections/project";
import { Project } from "./Project";
import Group from "@italodeandra/ui/components/Group";
import Stack from "@italodeandra/ui/components/Stack";
import { newProjectState } from "../new-project/newProject.state";
import { PlusIcon } from "@heroicons/react/20/solid";
import Button from "@italodeandra/ui/components/Button";
import Tooltip from "@italodeandra/ui/components/Tooltip";
import Skeleton from "@italodeandra/ui/components/Skeleton";
import DropdownMenu from "@italodeandra/ui/components/DropdownMenu";
import fakeArray from "@italodeandra/ui/utils/fakeArray";
import useMediaQuery from "@italodeandra/ui/hooks/useMediaQuery";
import defaultTheme from "tailwindcss/defaultTheme";
import { useSnapshot } from "valtio";
import { homeState } from "../home.state";
import { pull } from "lodash";

export default function Projects() {
  let { selectedProjects, setSelectedProjects } = useSnapshot(homeState);
  let { data: projects, isLoading: isLoading } = useProjectList();
  let isMobile = useMediaQuery(`(max-width: ${defaultTheme.screens.md})`);

  let projectsWithNone = useMemo(
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

  let selectedProjectsNames = useMemo(
    () =>
      projectsWithNone
        .filter((p) => selectedProjects.includes(p._id))
        .map((p) => p.name),
    [projectsWithNone, selectedProjects]
  );

  return (
    <>
      {isMobile ? (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button size="xs">
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
      ) : (
        <Stack>
          <div className="text-xs font-semibold">Projects</div>
          <Group className="items-center gap-1" wrap>
            {isLoading &&
              fakeArray(3).map((n) => (
                <Skeleton key={n} className="w-12 h-[26px]" />
              ))}
            {!isLoading &&
              projectsWithNone.map((project) => (
                <Project key={project._id} {...project} />
              ))}
            {!isLoading && (
              <Tooltip content="Create a new project">
                <Button
                  size="xs"
                  variant="text"
                  onClick={newProjectState.openModal}
                  icon
                >
                  <PlusIcon />
                </Button>
              </Tooltip>
            )}
          </Group>
        </Stack>
      )}
    </>
  );
}
