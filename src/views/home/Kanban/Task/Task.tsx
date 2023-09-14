import { useCallback, useMemo, useState } from "react";
import clsx from "clsx";
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Group from "@italodeandra/ui/components/Group/Group";
import Tooltip from "@italodeandra/ui/components/Tooltip/Tooltip";
import { ProjectSelector } from "./ProjectSelector";
import Button from "@italodeandra/ui/components/Button/Button";
import Stack from "@italodeandra/ui/components/Stack/Stack";
import Textarea from "@italodeandra/ui/components/Textarea/Textarea";
import Badge from "@italodeandra/ui/components/Badge/Badge";
import { useProjectList } from "../../../../pages/api/project/list";
import { Skeleton } from "@italodeandra/ui/components/Skeleton/Skeleton";
import { useTaskUpsert } from "../../../../pages/api/task/upsert";
import { TaskOptions } from "./TaskOptions";
import Loading from "@italodeandra/ui/components/Loading/Loading";
import { TaskListApiResponse } from "../../../../pages/api/task/list";
import { Timer } from "./Timer";
import { Icon } from "@iconify/react";
import { useSortable } from "@dnd-kit/sortable";
import { UniqueIdentifier } from "@dnd-kit/core";

let cardClassName = "rounded-md border text-sm";

export function Task({
  task,
  id,
}: {
  task: TaskListApiResponse[0];
  id: UniqueIdentifier;
}) {
  let [isEditing, setEditing] = useState(!task.content);
  let [newValue, setNewValue] = useState(task.content);
  let [selectedProjectId, setSelectedProjectId] = useState(
    task.projectId || null
  );
  const { setActivatorNodeRef, listeners } = useSortable({ id });

  let toggleEditing = useCallback(() => setEditing((v) => !v), []);

  let { data: projects, isLoading: isLoadingProject } = useProjectList();
  let project = useMemo(
    () => projects?.find((p) => p._id === task.projectId),
    [projects, task.projectId]
  );

  let { mutate: upsert, isLoading: isUpserting } = useTaskUpsert({
    onSuccess() {
      setEditing(false);
    },
  });
  let handleSaveClick = useCallback(
    () =>
      upsert({
        _id: task._id,
        content: newValue,
        projectId: selectedProjectId || undefined,
        status: task.status,
        order: task.order,
      }),
    [newValue, selectedProjectId, task._id, task.order, task.status, upsert]
  );

  return (
    <>
      {isEditing ? (
        <Stack
          className={clsx(
            cardClassName,
            "border-zinc-300 bg-zinc-200 ring-1 ring-zinc-300 dark:border-zinc-600 dark:bg-zinc-700 dark:ring-zinc-600" // default
          )}
        >
          <Textarea
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
                  color="default"
                  onClick={handleSaveClick}
                >
                  {isUpserting ? (
                    <Loading className="!h-4 !w-4" />
                  ) : (
                    <CheckIcon />
                  )}
                </Button>
              </Tooltip>
            </Group>
          </Group>
        </Stack>
      ) : (
        <Stack
          tabIndex={0}
          className={clsx(
            cardClassName,
            "group relative cursor-default px-2.5 pt-2 pb-2.5 transition-shadow",
            "border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900", // default
            "hover:shadow hover:shadow-zinc-200 dark:hover:shadow-zinc-800", // hover
            "focus:shadow focus:shadow-zinc-200 focus:outline-none dark:focus:shadow-zinc-800" // focus
          )}
          onDoubleClick={toggleEditing}
        >
          <div
            className={clsx(
              "markdown text-md prose !inline cursor-text text-inherit",
              "prose-p:!leading-normal",
              "prose-strong:text-inherit",
              "prose-ul:!my-0 prose-ul:!pl-5",
              "prose-li:!my-0 prose-li:!pl-0",
              "[&_.task-list-item]:ml-1.5",
              "[&_input[type='checkbox']]:!-ml-6.5 [&_input[type='checkbox']:checked]:!bg-primary-500 [&_input[type='checkbox']]:rounded-sm [&_input[type='checkbox']]:border-none [&_input[type='checkbox']]:bg-zinc-400/50 dark:[&_input[type='checkbox']]:bg-zinc-500/50",
              "prose-a:text-primary-500",
              "[&_hr]:-mt-5 [&_hr]:mb-0 [&_hr]:h-auto [&_hr]:border-none [&_hr]:after:text-zinc-400 [&_hr]:after:content-['[...]'] dark:[&_hr]:after:text-zinc-600 [&_hr_~_*]:hidden",
              "group-focus:[&_hr]:hidden group-focus:[&_hr_~_*]:block"
            )}
            dangerouslySetInnerHTML={{ __html: task.html }}
          />

          <Group>
            {isLoadingProject ? (
              <Skeleton className="h-[20px] w-14" />
            ) : (
              project && (
                <Badge size="sm" className="!rounded">
                  {project.name}
                </Badge>
              )
            )}
            <div className="flex-grow" />
            <Timer task={task} />
            <div
              tabIndex={0}
              ref={setActivatorNodeRef}
              {...listeners}
              className="outline-none"
            >
              <Icon
                icon="radix-icons:drag-handle-dots-2"
                className="m-2 h-5 w-5 cursor-grab text-zinc-500 sm:m-1"
                // onClick={(e) => {
                //   e.preventDefault();
                //   e.stopPropagation();
                //   return false;
                // }}
                // onDoubleClick={(e) => {
                //   e.preventDefault();
                //   e.stopPropagation();
                //   return false;
                // }}
              />
            </div>
          </Group>
          <TaskOptions task={task} onEditClick={() => setEditing(true)} />
        </Stack>
      )}
    </>
  );
}
