import { useTaskList } from "../../pages/api/task/list";
import { useMemo, useState } from "react";
import { Kanban } from "./kanban/Kanban";
import Select from "@italodeandra/ui/components/Select";
import { translateTaskStatus } from "../../utils/translateTaskStatus";
import { TaskStatus } from "../../collections/task";
import { Timer } from "./task/Timer";
import Group from "@italodeandra/ui/components/Group";
import clsx from "@italodeandra/ui/utils/clsx";

export function HomeView() {
  let [orientation, setOrientation] = useState<"horizontal" | "vertical">(
    "vertical"
  );
  let { data: databaseTasks, isLoading } = useTaskList();

  let kanbanTasks = useMemo(() => {
    return (
      databaseTasks?.map(({ status, order, titleHtml, ...task }) => ({
        ...task,
        columnId: status,
        index: order,
        content: titleHtml,
      })) || []
    );
  }, [databaseTasks]);

  return (
    <>
      <Select.Root
        onValueChange={(value) => setOrientation(value as typeof orientation)}
        value={orientation}
      >
        <Select.Trigger />
        <Select.Content>
          <Select.Item value="vertical">Vertical</Select.Item>
          <Select.Item value="horizontal">Horizontal</Select.Item>
        </Select.Content>
      </Select.Root>
      <Kanban
        orientation={orientation}
        value={kanbanTasks}
        onChangeValue={console.log}
        renderColumn={(column) => (
          <>{translateTaskStatus(column as TaskStatus)}</>
        )}
        renderItem={(item) => (
          <Group
            className={clsx("flex gap-2 w-full py-1 px-1", {
              "flex-col": orientation === "horizontal",
            })}
          >
            <div
              className="text-sm [&_a]:truncate [&_a]:block overflow-hidden pl-0.5"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
            <Group className="items-center ml-auto">
              <Timer task={item} />
            </Group>
          </Group>
        )}
      />
    </>
  );
}
