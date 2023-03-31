import { useCallback, useMemo, useState } from "react";
import clsx from "clsx";
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { Reorder } from "framer-motion";
import Group from "@italodeandra/ui/components/Group/Group";
import Tooltip from "@italodeandra/ui/components/Tooltip/Tooltip";
import { ProjectSelector } from "./ProjectSelector";
import Button from "@italodeandra/ui/components/Button/Button";
import Stack from "@italodeandra/ui/components/Stack/Stack";
import Textarea from "@italodeandra/ui/components/Textarea/Textarea";
import Badge from "@italodeandra/ui/components/Badge/Badge";
import { useProjectList } from "../../../../pages/api/project/list";
import { Skeleton } from "@italodeandra/ui/components/Skeleton/Skeleton";
import { ITask } from "../../../../collections/task";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import { useTaskUpsert } from "../../../../pages/api/task/upsert";
import { TaskOptions } from "./TaskOptions";
import Markdown from "@italodeandra/ui/components/Markdown/Markdown";
import Loading from "@italodeandra/ui/components/Loading/Loading";

let cardClassName = "rounded-md border text-sm";

export function Task({
  task,
}: {
  task: Pick<Jsonify<ITask>, "_id" | "content" | "status"> &
    Pick<Partial<Jsonify<ITask>>, "projectId">;
}) {
  let [isEditing, setEditing] = useState(!task.content);
  let [newValue, setNewValue] = useState(task.content);
  let [selectedProjectId, setSelectedProjectId] = useState(
    task.projectId || null
  );

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
      }),
    [newValue, selectedProjectId, task._id, upsert]
  );

  let handleDeleteClick = useCallback(() => {
    upsert({
      _id: task._id,
      content: "",
    });
  }, [task._id, upsert]);

  return (
    <Reorder.Item value={task}>
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
                  color="white"
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
            "group relative select-none px-2.5 pt-2 pb-2.5 transition-shadow",
            "border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900", // default
            "hover:shadow hover:shadow-zinc-200 dark:hover:shadow-zinc-800", // hover
            "focus:shadow focus:shadow-zinc-200 focus:outline-none dark:focus:shadow-zinc-800" // focus
          )}
          onDoubleClick={toggleEditing}
        >
          <Markdown className="!text-md !inline prose-p:!leading-normal prose-ul:!my-0 prose-ul:!pl-5 prose-li:!my-0 prose-li:!pl-0">
            {task.content}
          </Markdown>

          {(!!project || isLoadingProject) && (
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
            </Group>
          )}
          <TaskOptions
            task={task}
            onEditClick={() => setEditing(true)}
            onDeleteClick={handleDeleteClick}
          />
        </Stack>
      )}
    </Reorder.Item>
  );
}
