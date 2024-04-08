import { ProjectListApiResponse } from "../../../../pages/api/project/list";
import { useSnapshot } from "valtio";
import { useProjectArchive } from "../../../../pages/api/project/archive";
import ContextMenu from "@italodeandra/ui/components/ContextMenu";
import Button from "@italodeandra/ui/components/Button/Button";
import { xor } from "lodash";
import React, { useCallback } from "react";
import { homeState } from "../../../home/home.state";

export function Project(project: ProjectListApiResponse[0]) {
  let { selectedProjects, setSelectedProjects } = useSnapshot(homeState);
  let { mutate: archive, isLoading } = useProjectArchive();

  let handleProjectSelect = useCallback(() => {
    setSelectedProjects(xor(selectedProjects, [project._id]));
  }, [project._id, selectedProjects, setSelectedProjects]);

  let handleProjectArchive = useCallback(() => {
    archive(project);
  }, [archive, project]);

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        <Button
          size="xs"
          variant={
            selectedProjects.includes(project._id) ? "filled" : "outlined"
          }
          color={selectedProjects.includes(project._id) ? "primary" : undefined}
          onClick={handleProjectSelect}
          loading={isLoading}
        >
          {project.name}
        </Button>
      </ContextMenu.Trigger>

      <ContextMenu.Content>
        <ContextMenu.Item onSelect={handleProjectArchive}>
          Archive
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
