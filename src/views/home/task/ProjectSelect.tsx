import { useState } from "react";
import { useProjectList } from "../../../pages/api/project/list";
import { useTaskUpdate } from "../../../pages/api/task/update";
import Select from "@italodeandra/ui/components/Select";
import clsx from "@italodeandra/ui/utils/clsx";
import { ITask } from "./Task";
import { useUpdateEffect } from "react-use";

export function ProjectSelect({ drag, ...task }: ITask & { drag: boolean }) {
  let [value, setValue] = useState(task.project?._id || "NONE");
  let { data: projects, isLoading } = useProjectList();
  let { mutate: update, isLoading: isUpdating } = useTaskUpdate();

  useUpdateEffect(() => {
    if (value !== (task.project?._id || "NONE")) {
      update({
        _id: task._id,
        projectId: value,
      });
    }
  }, [task._id, task.project?._id, update, value]);

  let valueElement = (
    <div
      className={clsx(
        "rounded px-1 text-xs mt-0.5 opacity-0 group-hover:opacity-100",
        "bg-zinc-300 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
        {
          "animate-pulse": isLoading || isUpdating,
          "opacity-100": !value || value !== "NONE",
        }
      )}
    >
      {drag ? task.project?.name : <Select.Value />}
    </div>
  );

  if (drag) {
    return valueElement;
  }

  return (
    <Select.Root onValueChange={setValue} value={value}>
      <Select.Trigger>{valueElement}</Select.Trigger>
      <Select.Content>
        <Select.Item value="NONE" className="opacity-50">
          None
        </Select.Item>
        {projects?.map((project) => (
          <Select.Item key={project._id} value={project._id}>
            {project.name}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
