import { useTaskList } from "../../pages/api/task/list";
import { useMemo, useState } from "react";
import { Kanban } from "./kanban/Kanban";
import Select from "@italodeandra/ui/components/Select";
import { translateTaskStatus } from "../../utils/translateTaskStatus";
import { TaskStatus } from "../../collections/task";
import { Timer } from "./task/Timer";
import Group from "@italodeandra/ui/components/Group";
import clsx from "@italodeandra/ui/utils/clsx";
import dayjs from "dayjs";
import { Bars3Icon, ViewColumnsIcon } from "@heroicons/react/16/solid";
import Button from "@italodeandra/ui/components/Button";

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
      <Group className="justify-end px-2">
        <Select.Root
          onValueChange={(value) => setOrientation(value as typeof orientation)}
          value={orientation}
        >
          <Select.Trigger>
            <Button icon size="xs">
              <Select.Value asChild>
                {orientation === "vertical" ? (
                  <Bars3Icon className="w-3 h-3" />
                ) : (
                  <ViewColumnsIcon className="w-3 h-3" />
                )}
              </Select.Value>
            </Button>
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="vertical">
              <Group className="items-center">
                <span>Vertical</span>
                <Bars3Icon className="ml-auto w-3 h-3 -mr-5" />
              </Group>
            </Select.Item>
            <Select.Item value="horizontal">
              <Group className="items-center">
                <span>Horizontal</span>
                <ViewColumnsIcon className="ml-auto w-3 h-3 -mr-5" />
              </Group>
            </Select.Item>
          </Select.Content>
        </Select.Root>
      </Group>
      <Kanban
        orientation={orientation}
        value={kanbanTasks}
        onChangeValue={console.log}
        renderColumn={(column) => (
          <>{translateTaskStatus(column as TaskStatus)}</>
        )}
        renderItem={(item) => (
          <Group
            className={clsx("flex gap-2 w-full py-1 px-1 group", {
              "flex-col": orientation === "horizontal",
            })}
          >
            <div
              className="text-sm [&_a]:truncate [&_a]:block overflow-hidden pl-0.5"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
            <Group
              className={clsx({
                "items-start ml-auto": orientation === "vertical",
                "items-end": orientation === "horizontal",
              })}
            >
              <div className="bg-zinc-800 rounded px-1 text-xs mt-0.5 text-zinc-300">
                {item.project}
              </div>
              <div
                title={dayjs(item.createdAt).format("LLL")}
                className="mt-[3px] text-zinc-500 text-xs"
              >
                {dayjs(item.createdAt).format("ll")}
              </div>
              <Timer
                task={item}
                className={clsx("-m-1 -mt-[3px] transition", {
                  "ml-auto": orientation === "horizontal",
                  "group-hover:opacity-100 opacity-0":
                    !item.timesheet?.totalTime && orientation === "horizontal",
                })}
              />
            </Group>
          </Group>
        )}
      />
    </>
  );
}
