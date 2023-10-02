import React from "react";
import Group from "@italodeandra/ui/components/Group/Group";
import Text from "@italodeandra/ui/components/Text";
import { useProjectList } from "../../../../pages/api/project/list";
import Stack from "@italodeandra/ui/components/Stack/Stack";
import { ProjectColor } from "../../../../collections/project";
import { Project } from "../Project";
import { Skeleton } from "@italodeandra/ui/components/Skeleton/Skeleton";
import Button from "@italodeandra/ui/components/Button/Button";
import { newProjectState } from "../task/new-project/newProject.state";
import { PlusIcon } from "@heroicons/react/20/solid";
import { ModeToggle } from "@italodeandra/ui/components/ModeToggle/ModeToggle";
import UserMenu from "../../../panel/layout/UserMenu";
import { TimesheetStatus } from "./TimesheetStatus";

export function Header() {
  let { data: projects, isLoading: isLoadingProjects } = useProjectList();

  return (
    <div className="flex flex-col-reverse gap-2 px-4 sm:flex-row">
      <Stack>
        <Text variant="label">Projects</Text>
        <Group className="-mx-4 overflow-x-auto px-4 sm:flex-wrap">
          {[
            {
              _id: "",
              name: "None",
              lastTaskUpdatedAt: "",
              color: ProjectColor.BLUE,
            },
            ...(projects || []),
          ]?.map((project) => (
            <Project key={project._id} project={project} />
          ))}
          {isLoadingProjects ? (
            <Skeleton className="w-20" />
          ) : (
            <Button
              size="sm"
              variant="outlined"
              onClick={() => newProjectState.openModal()}
              icon
            >
              <PlusIcon />
            </Button>
          )}
        </Group>
      </Stack>
      <div className="flex-grow" />
      <Group className="mb-auto pb-0">
        <TimesheetStatus />
        <div className="flex-grow sm:hidden"></div>
        <ModeToggle />
        <UserMenu />
      </Group>
    </div>
  );
}
