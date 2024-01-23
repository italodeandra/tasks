import Group from "@italodeandra/ui/components/Group";
import clsx from "@italodeandra/ui/utils/clsx";
import dayjs from "dayjs";
import { Timer } from "./Timer";
import { TaskListApiResponse } from "../../../pages/api/task/list";
import { useSnapshot } from "valtio";
import { homeState } from "../home.state";
import { Orientation } from "../kanban/Orientation";
import { KeyboardEvent, useCallback, useMemo, useState } from "react";
import Textarea from "@italodeandra/ui/components/Textarea";
import { PencilIcon } from "@heroicons/react/16/solid";
import { useTaskUpdate } from "../../../pages/api/task/update";
import Loading from "@italodeandra/ui/components/Loading";
import ContextMenu from "@italodeandra/ui/components/ContextMenu";
import { useTaskRemove } from "../../../pages/api/task/remove";
import { ProjectSelect } from "./ProjectSelect";

export type ITask = Omit<
  TaskListApiResponse[number],
  "status" | "order" | "titleHtml"
> & {
  index: number;
  content: string;
  columnId: string;
};

function Task({ drag, ...task }: ITask & { drag: boolean }) {
  let { orientation, selectedProjects } = useSnapshot(homeState);
  let [isEditing, setEditing] = useState(!task.content);
  let [newValue, setNewValue] = useState(task.title);

  let handleDoubleClick = useCallback(() => {
    setEditing(true);
  }, []);

  let { mutate: remove, isLoading: isRemoving } = useTaskRemove();
  let handleDeleteClick = useCallback(() => {
    remove({
      _id: task._id,
    });
  }, [remove, task._id]);
  let { mutate: update, isLoading: isUpdating } = useTaskUpdate({
    onSuccess() {
      setEditing(false);
    },
  });
  let handleSaveClick = useCallback(() => {
    if (newValue) {
      update({
        _id: task._id,
        content: newValue,
      });
    } else {
      handleDeleteClick();
    }
  }, [handleDeleteClick, newValue, task._id, update]);

  let handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSaveClick();
      }
      if (e.key === "Escape") {
        if (task.content) {
          setEditing(false);
        } else {
          handleDeleteClick();
        }
      }
    },
    [handleDeleteClick, handleSaveClick, task.content]
  );

  let dimmed = useMemo(
    () =>
      !selectedProjects.length
        ? false
        : !selectedProjects.some((selectedProject) => {
            return (
              task.project?._id ===
              (selectedProject === "NONE" ? undefined : selectedProject)
            );
          }),
    [task.project, selectedProjects]
  );

  let taskClassName = clsx("w-full rounded bg-zinc-200 dark:bg-zinc-900", {
    "flex-col": orientation === Orientation.HORIZONTAL,
  });

  let taskElement = (
    <Group
      className={clsx(taskClassName, "flex py-1 px-1 group", {
        "opacity-40": dimmed,
        "gap-2": orientation === Orientation.VERTICAL,
        "gap-1": orientation === Orientation.HORIZONTAL,
      })}
      onDoubleClick={handleDoubleClick}
    >
      <div
        className="text-sm [&_a]:truncate [&_a]:block overflow-hidden px-0.5"
        dangerouslySetInnerHTML={{ __html: task.content }}
      />
      {newValue !== task.title && (
        <div
          className={clsx(
            "rounded px-1 py-0.5 text-xs flex gap-1 items-center mb-auto",
            "bg-zinc-300 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          )}
        >
          <PencilIcon className="w-4 h-4" /> Unsaved changes
        </div>
      )}
      <Group
        className={clsx({
          "items-start ml-auto": orientation === Orientation.VERTICAL,
          "items-end justify-end": orientation === Orientation.HORIZONTAL,
        })}
      >
        <ProjectSelect {...task} drag={drag} />
        <div
          title={dayjs(task.createdAt).format("LLL")}
          className="mt-[3px] text-zinc-500 text-xs whitespace-nowrap"
        >
          {dayjs(task.createdAt).format("ll")}
        </div>
        <Timer
          task={task}
          className={clsx("-m-1 -mt-[3px] transition", {
            "group-hover:opacity-100 opacity-50": !task.timesheet,
          })}
        />
      </Group>
    </Group>
  );

  if (drag) {
    return taskElement;
  }

  if (isEditing) {
    return (
      <Textarea
        className={clsx(taskClassName)}
        innerClassName=""
        inputClassName="border-0 rounded bg-transparent py-1 px-1.5 ring-1 transition"
        value={newValue}
        onChange={(e) => setNewValue(e.target.value)}
        autoFocus
        onKeyDown={handleKeyDown}
        trailing={
          isUpdating || isRemoving ? (
            <Loading />
          ) : (
            <PencilIcon className="w-5 h-5" />
          )
        }
        trailingClassName="items-start pt-1 pr-1"
      />
    );
  }

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{taskElement}</ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item onClick={handleDeleteClick}>Delete</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}

export function renderTask(item: ITask, drag: boolean) {
  return <Task {...item} drag={drag} />;
}
