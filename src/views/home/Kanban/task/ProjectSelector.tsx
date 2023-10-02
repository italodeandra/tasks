import { useProjectList } from "../../../../pages/api/project/list";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Skeleton } from "@italodeandra/ui/components/Skeleton/Skeleton";
import Menu from "@italodeandra/ui/components/Menu/Menu";
import Button from "@italodeandra/ui/components/Button/Button";
import { useSnapshot } from "valtio";
import { newProjectState } from "./new-project/newProject.state";

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
  let { openModal } = useSnapshot(newProjectState);

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
      <Menu
        label={selectedProject ? selectedProject.name : "Project"}
        className="mr-auto"
        position="left"
        buttonProps={{ size: "sm", variant: "filled", color: "default" }}
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
          leading={<PlusIcon />}
          size="sm"
          onClick={openModal}
        >
          Add new
        </Button>
      </Menu>
    </>
  );
}