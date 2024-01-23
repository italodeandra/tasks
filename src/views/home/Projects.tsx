import { useProjectList } from "../../pages/api/project/list";
import Loading from "@italodeandra/ui/components/Loading";
import React, { useMemo } from "react";
import { ProjectColor } from "../../collections/project";
import { Project } from "./Kanban2/Project";
import Group from "@italodeandra/ui/components/Group";
import Stack from "@italodeandra/ui/components/Stack";

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
      <Group className="items-center">
        {isLoading && <Loading />}
        {projectsWithNone.map((project) => (
          <Project key={project._id} {...project} />
        ))}
      </Group>
    </Stack>
  );
}
