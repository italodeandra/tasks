import { useProjectList } from "../../../../pages/api/project/list";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { NewProjectModal } from "./NewProjectModal";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Skeleton } from "@italodeandra/ui/components/Skeleton/Skeleton";
import Menu from "@italodeandra/ui/components/Menu/Menu";
import Button from "@italodeandra/ui/components/Button/Button";
import useModalState from "@italodeandra/ui/components/Modal/useModalState";

export function ProjectSelector({
  value,
  onValueChange,
}: {
  value?: string | null;
  onValueChange?: (value: string | null) => void;
}) {
  let { data: projects, isLoading, isError } = useProjectList();
  let [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    value || null
  );
  let newProjectModalState = useModalState();
  let [, { openModal }] = newProjectModalState;

  useEffect(() => setSelectedProjectId(value || null), [value]);
  useEffect(
    () => onValueChange?.(selectedProjectId),
    [onValueChange, selectedProjectId]
  );

  let selectedProject = useMemo(
    () => projects?.find((p) => p._id === selectedProjectId),
    [projects, selectedProjectId]
  );

  if (isLoading) {
    return <Skeleton className="h-[26px] w-20 dark:bg-zinc-500" />;
  }

  if (isError) {
    return null;
  }

  return (
    <>
      <NewProjectModal state={newProjectModalState} />
      <Menu
        label={selectedProject ? selectedProject.name : "Project"}
        className="mr-auto"
        position="left"
        buttonProps={{ size: "sm", variant: "filled", color: "white" }}
      >
        <Menu.Item
          className={clsx({
            "!bg-primary-500 !text-onPrimary": !selectedProjectId,
          })}
          onClick={() => setSelectedProjectId(null)}
        >
          None
        </Menu.Item>
        {projects?.map((project) => (
          <Menu.Item
            key={project._id}
            className={clsx({
              "!bg-primary-500 !text-onPrimary":
                selectedProjectId === project._id,
            })}
            onClick={() => setSelectedProjectId(project._id)}
          >
            {project.name}
          </Menu.Item>
        ))}
        <Button
          variant="text"
          className="w-full !justify-start rounded-none"
          leadingIcon={<PlusIcon />}
          size="sm"
          onClick={openModal}
        >
          Add new
        </Button>
      </Menu>
    </>
  );
}
