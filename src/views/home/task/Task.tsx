import Group from "@italodeandra/ui/components/Group";
import clsx from "@italodeandra/ui/utils/clsx";
import dayjs from "dayjs";
import { Timer } from "./Timer";
import { useSnapshot } from "valtio";
import { homeState } from "../home.state";
import { Orientation } from "../kanban/Orientation";
import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  Bars3BottomLeftIcon,
  ChatBubbleLeftIcon,
  PencilIcon,
} from "@heroicons/react/16/solid";
import { taskUpdateApi } from "../../../pages/api/task/update";
import ContextMenu from "@italodeandra/ui/components/ContextMenu";
import { ProjectSelect } from "./ProjectSelect";
import Button from "@italodeandra/ui/components/Button";
import useMediaQuery from "@italodeandra/ui/hooks/useMediaQuery";
import defaultTheme from "tailwindcss/defaultTheme";
import { ITask } from "./ITask";
import { columns } from "../../../consts";
import { translateTaskStatus } from "../../../utils/translateTaskStatus";
import { TaskStatus } from "../../../collections/task";
import { pull } from "lodash";
import useDebouncedValue from "@italodeandra/ui/hooks/useDebouncedValue";
import { showDialog } from "@italodeandra/ui/components/Dialog";
import { TaskDetails } from "./details/TaskDetails";
import { Markdown } from "./Markdown";
import { taskRemoveApi } from "../../../pages/api/task/remove";

export default function Task(task: ITask) {
  let { orientation, selectedProjects, editingTasks, setEditingTasks } =
    useSnapshot(homeState);

  let isEditing = editingTasks.includes(task._id);
  let setEditing = useCallback(
    (editing: boolean) => {
      setEditingTasks(
        editing
          ? [...editingTasks, task._id]
          : pull([...editingTasks], task._id)
      );
    },
    [editingTasks, setEditingTasks, task._id]
  );

  let [newValue, setNewValue] = useState(task.content);
  let isMobile = useMediaQuery(`(max-width: ${defaultTheme.screens.md})`);
  let [oneClicked, setOneClicked] = useState(false);
  let debouncedOneClicked = useDebouncedValue(oneClicked, "500ms");

  useEffect(() => {
    if (task.content !== newValue) {
      setNewValue(task.content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task.content]);

  useEffect(() => {
    if (debouncedOneClicked) {
      setOneClicked(false);
      showDialog({
        content: <TaskDetails _id={task._id} />,
      });
    }
  }, [debouncedOneClicked, task._id]);

  let handleClick = useCallback(() => {
    if (!isEditing) {
      setOneClicked(true);
    }
  }, [isEditing]);

  let handleDoubleClick = useCallback(() => {
    setOneClicked(false);
    setEditing(true);
  }, [setEditing]);

  let { mutate: remove } = taskRemoveApi.useMutation();
  let handleDeleteClick = useCallback(() => {
    remove({
      _id: task._id,
    });
  }, [remove, task._id]);
  let { mutate: update, isLoading: isUpdating } = taskUpdateApi.useMutation();
  let handleSaveClick = useCallback(
    (newValue: string) => {
      setEditing(false);
      setNewValue(newValue);
      if (newValue) {
        update({
          _id: task._id,
          title: newValue,
        });
      } else {
        handleDeleteClick();
      }
    },
    [handleDeleteClick, setEditing, task._id, update]
  );

  let handleMoveStatusClick = useCallback(
    (status: TaskStatus) => () =>
      update({
        _id: task._id,
        status,
        order: -1,
      }),
    [task._id, update]
  );

  let handleClearChanges = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      setNewValue(task.content);
    },
    [task.content]
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

  let handleContextMenu = useCallback(
    (e: MouseEvent) => e.preventDefault(),
    []
  );

  let taskElement = (
    <Group
      className={clsx(taskClassName, "flex p-1 group", {
        "opacity-40": dimmed,
        "gap-2": orientation === Orientation.VERTICAL,
        "gap-1": orientation === Orientation.HORIZONTAL,
      })}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={isMobile ? handleContextMenu : undefined}
    >
      <Markdown
        value={task.content}
        className="text-sm flex-1 overflow-hidden px-1.5 py-1 -m-1 min-h-[28px] [&_.task-list-item]:pl-0.5"
        onChange={handleSaveClick}
        editable
        loading={isUpdating}
        editing={isEditing}
        onChangeEditing={setEditing}
      />
      <Group
        className={clsx({
          "items-center ml-auto": orientation === Orientation.VERTICAL,
          "items-end justify-end": orientation === Orientation.HORIZONTAL,
        })}
      >
        {(task.description || task.comments) && (
          <Group className="items-center gap-1">
            {task.description && <Bars3BottomLeftIcon className="w-3 h-3" />}
            {task.comments && (
              <>
                <ChatBubbleLeftIcon className="w-3 h-3" />
                <div className="text-xs">{task.comments}</div>
              </>
            )}
          </Group>
        )}
        {!isEditing && newValue !== task.content && (
          // eslint-disable-next-line react/jsx-no-undef
          <Button
            size="xs"
            className={clsx(
              "rounded px-0.5 py-0 text-xs flex gap-1 items-center border-transparent dark:border-transparent",
              "bg-zinc-300 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 group/changes"
            )}
            onClick={handleClearChanges}
          >
            <PencilIcon className="w-4 h-4" />{" "}
            <span className="group-hover/changes:hidden">Unsaved</span>
            <span className="hidden group-hover/changes:inline">
              Clear
            </span>{" "}
            changes
          </Button>
        )}
        <ProjectSelect {...task} />
        <div
          title={dayjs(task.createdAt).format("LLL")}
          className="text-zinc-500 text-xs whitespace-nowrap"
        >
          {dayjs(task.createdAt).format("ll")}
        </div>
        <Timer
          task={task}
          className={clsx("-m-1 transition", {
            "group-hover:opacity-100 opacity-50": !task.timesheet,
          })}
        />
      </Group>
    </Group>
  );

  if (isMobile) {
    return taskElement;
  }

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{taskElement}</ContextMenu.Trigger>
      <ContextMenu.Content>
        {columns
          .filter((c) => c !== task.columnId)
          .map((status) => (
            <ContextMenu.Item
              key={status}
              onClick={handleMoveStatusClick(status)}
            >
              Move to {translateTaskStatus(status)}
            </ContextMenu.Item>
          ))}
        <ContextMenu.Item onClick={handleDeleteClick}>Delete</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
