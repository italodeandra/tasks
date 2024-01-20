import { useProjectList } from "../../pages/api/project/list";
import Loading from "@italodeandra/ui/components/Loading";
import React, { useMemo } from "react";
import { ProjectColor } from "../../collections/project";
import { Project } from "./Kanban2/Project";
import Group from "@italodeandra/ui/components/Group";

export function Projects() {
  let { data: projects, isLoading: isLoading } = useProjectList();

  let projectsWithNone = useMemo(
    () => [
      {
        _id: "",
        name: "None",
        lastTaskUpdatedAt: "",
        color: ProjectColor.BLUE,
      },
      ...(projects || []),
    ],
    [projects]
  );

  return (
    <Group className="px-2 pb-2">
      {isLoading && <Loading />}
      {projectsWithNone.map((project) => (
        <Project key={project._id} project={project} />
      ))}
    </Group>
  );
}
