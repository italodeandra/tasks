import { ProjectListApiResponse } from "../../../pages/api/project/list";
import { useSnapshot } from "valtio";
import { selectedProjectsState } from "./selectedProjects.state";
import { useProjectArchive } from "../../../pages/api/project/archive";
import * as ContextMenu from "@radix-ui/react-context-menu";
import Button from "@italodeandra/ui/components/Button/Button";
import { xor } from "lodash";
import clsx from "clsx";
import React from "react";

export function Project({ project }: { project: ProjectListApiResponse[0] }) {
  let { selectedProjects } = useSnapshot(selectedProjectsState);
  let { mutate: archive, isLoading } = useProjectArchive();

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        <Button
          size="sm"
          variant={
            selectedProjects.includes(project._id) ? "filled" : "outlined"
          }
          color={selectedProjects.includes(project._id) ? "primary" : undefined}
          onClick={() =>
            (selectedProjectsState.selectedProjects = xor(selectedProjects, [
              project._id,
            ]))
          }
          loading={isLoading}
        >
          {project.name}
        </Button>
      </ContextMenu.Trigger>

      <ContextMenu.Portal>
        <ContextMenu.Content
          className={clsx(
            "min-w-[144px] rounded-md border p-[5px] shadow-[0px_4px_12px_0px_rgba(108,115,127,0.16)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade",
            "border-zinc-100 bg-white",
            "dark:border-zinc-700 dark:bg-zinc-800"
          )}
        >
          <ContextMenu.Item
            onSelect={() => archive(project)}
            className={clsx(
              "group relative flex h-[38px] select-none items-center gap-[10px] rounded-[6px] px-[12px] text-sm font-medium leading-none outline-none data-[disabled]:pointer-events-none",
              " data-[highlighted]:bg-zinc-100",
              " dark:data-[highlighted]:bg-zinc-700"
            )}
          >
            Arquivar
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
