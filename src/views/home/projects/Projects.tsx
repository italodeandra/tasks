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
import fakeArray from "@italodeandra/ui/utils/fakeArray";

export function Projects() {
  let { data: projects, isLoading: isLoading } = useProjectList();

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

  return (
    <Stack>
      <div className="text-xs font-semibold">Projects</div>
      <Group className="items-center gap-1">
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
  );
}
