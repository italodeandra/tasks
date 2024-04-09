import { ProjectListApi } from "../../../../pages/api/project/list";
import { useSnapshot } from "valtio";
import { useProjectArchive } from "../../../../pages/api/project/archive";
import ContextMenu from "@italodeandra/ui/components/ContextMenu";
import { pull } from "lodash";
import React, { useCallback } from "react";
import { homeState } from "../../../home/home.state";
import DropdownMenu from "@italodeandra/ui/components/DropdownMenu";

export function Project(project: ProjectListApi["Response"][0]) {
  const { selectedProjects, setSelectedProjects } = useSnapshot(homeState);
  const { mutate: archive } = useProjectArchive();

  const handleProjectArchive = useCallback(() => {
    archive(project);
    setSelectedProjects([...selectedProjects.filter((p) => p !== project._id)]);
  }, [archive, project, selectedProjects, setSelectedProjects]);

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
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
      </ContextMenu.Trigger>

      <ContextMenu.Content>
        <ContextMenu.Item onSelect={handleProjectArchive}>
          Archive
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
