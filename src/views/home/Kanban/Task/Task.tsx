import { useCallback, useState } from "react";
import clsx from "clsx";
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { TaskListApiResponse } from "../../../../pages/api/task/list";
import { Reorder, useDragControls } from "framer-motion";
import Group from "@italodeandra/ui/components/Group/Group";
import Tooltip from "@italodeandra/ui/components/Tooltip/Tooltip";
import { ProjectSelector } from "./ProjectSelector";
import Button from "@italodeandra/ui/components/Button/Button";
import Stack from "@italodeandra/ui/components/Stack/Stack";
import Textarea from "@italodeandra/ui/components/Textarea/Textarea";

let cardClassName = "rounded-md border text-sm";

export function Task({ task }: { task: TaskListApiResponse[0] }) {
  let [isEditing, setEditing] = useState(false);
  let controls = useDragControls();
  let [newValue, setNewValue] = useState(task.content);
  let [selectedProjectId, setSelectedProjectId] = useState(
    task.projectId || null
  );

  let toggleEditing = useCallback(() => setEditing((v) => !v), []);

  return (
    <Reorder.Item value={task} dragListener={false} dragControls={controls}>
      {isEditing ? (
        <Stack
          className={clsx(
            cardClassName,
            "border-zinc-300 bg-zinc-200 ring-1 ring-zinc-300 dark:border-zinc-600 dark:bg-zinc-700 dark:ring-zinc-600" // default
            // "flex flex-col border border-gray-5 bg-gray-2 bg-gray-2 ring-1 ring-gray-5"
          )}
        >
          <Textarea
            // className="w-full rounded-[inherit] !border-0 bg-gray-1 py-2 px-2.5 !outline-0 !ring-0"
            inputClassName="!border-transparent focus:!border-primary-500"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            autoFocus
          />
          <Group className="justify-between px-2 pb-2">
            <ProjectSelector
              value={selectedProjectId}
              onValueChange={setSelectedProjectId}
            />
            <Group>
              <Tooltip content="Close">
                <Button icon size="sm" variant="text" onClick={toggleEditing}>
                  <XMarkIcon />
                </Button>
              </Tooltip>
              <Tooltip content="Save">
                <Button
                  icon
                  size="sm"
                  variant="outlined"
                  color="white"
                  onClick={toggleEditing}
                >
                  <CheckIcon />
                </Button>
              </Tooltip>
            </Group>
          </Group>
        </Stack>
      ) : (
        <div
          tabIndex={0}
          className={clsx(
            cardClassName,
            "select-none py-2 px-2.5 transition-shadow ",
            "border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900", // default
            "hover:shadow hover:shadow-zinc-200 dark:hover:shadow-zinc-800", // hover
            "focus:shadow focus:shadow-zinc-200 focus:outline-none dark:focus:shadow-zinc-800" // focus
          )}
          onDoubleClick={toggleEditing}
          onPointerDown={(e) => controls.start(e)}
        >
          {task.content}
        </div>
      )}
    </Reorder.Item>
  );
}
