import { useState } from "react";
import { taskUpdateApi } from "../../../../pages/api/task/update";
import Select from "@italodeandra/ui/components/Select";
import clsx from "@italodeandra/ui/utils/clsx";
import { useUpdateEffect } from "react-use";
import useMediaQuery from "@italodeandra/ui/hooks/useMediaQuery";
import defaultTheme from "tailwindcss/defaultTheme";
import { translateTaskStatus } from "../../../../utils/translateTaskStatus";
import { TaskStatus } from "../../../../collections/task";
import { columns } from "../../../../consts";

export function ColumnSelect({
                               triggerClassName,
                               ...task
                             }: {
  _id: string;
  status: string;
  triggerClassName?: string;
}) {
  const [value, setValue] = useState(task.status);
  const { mutate: update, isPending: isUpdating } = taskUpdateApi.useMutation();
  const isMobile = useMediaQuery(`(max-width: ${defaultTheme.screens.md})`);

  useUpdateEffect(() => {
    if (value !== task.status) {
      update({
        _id: task._id,
        status: value as TaskStatus
      });
    }
  }, [task._id, task.status, update, value]);

  triggerClassName = clsx(
    "rounded px-1 min-h-[18px] flex items-center",
    "bg-zinc-300 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
    {
      "animate-pulse": isUpdating
    },
    triggerClassName
  );

  if (isMobile) {
    return task.status ? (
      <div className={triggerClassName}>{translateTaskStatus(task.status)}</div>
    ) : null;
  }

  return (
    <Select.Root onValueChange={setValue} value={value}>
      <Select.Trigger>
        <div className={triggerClassName}>
          <Select.Value />
        </div>
      </Select.Trigger>
      <Select.Content>
        {columns?.map((status) => (
          <Select.Item key={status} value={status}>
            {translateTaskStatus(status)}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
