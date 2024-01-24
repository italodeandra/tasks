import Group from "@italodeandra/ui/components/Group";
import clsx from "@italodeandra/ui/utils/clsx";
import dayjs from "dayjs";
import { Timer } from "./Timer";
import { useSnapshot } from "valtio";
import { homeState } from "../home.state";
import { Orientation } from "../kanban/Orientation";
import {
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PencilIcon } from "@heroicons/react/16/solid";
import { useTaskUpdate } from "../../../pages/api/task/update";
import ContextMenu from "@italodeandra/ui/components/ContextMenu";
import { useTaskRemove } from "../../../pages/api/task/remove";
import { ProjectSelect } from "./ProjectSelect";
import Button from "@italodeandra/ui/components/Button";
import useMediaQuery from "@italodeandra/ui/hooks/useMediaQuery";
import defaultTheme from "tailwindcss/defaultTheme";
import { ITask } from "./ITask";
import Loading from "@italodeandra/ui/components/Loading";
import { columns } from "../../../consts";
import { translateTaskStatus } from "../../../utils/translateTaskStatus";
import { TaskStatus } from "../../../collections/task";
import { pull } from "lodash";

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

  useEffect(() => {
    if (isEditing !== !task.content) {
      setEditing(!task.content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task.content]);

  let [newValue, setNewValue] = useState(task.title);
  let contentRef = useRef<HTMLDivElement>(null);
  let isMobile = useMediaQuery(`(max-width: ${defaultTheme.screens.md})`);

  let handleDoubleClick = useCallback(() => {
    setEditing(true);
    setTimeout(() => contentRef.current?.focus());
  }, [setEditing]);

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
  let handleSaveClick = useCallback(
    (newValue: string) => {
      if (newValue) {
        update({
          _id: task._id,
          content: newValue,
        });
      } else {
        handleDeleteClick();
      }
    },
    [handleDeleteClick, task._id, update]
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

  let handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        setNewValue(e.currentTarget.innerText);
        handleSaveClick(e.currentTarget.innerText);
      }
      if (e.key === "Escape") {
        if (task.content) {
          setNewValue(e.currentTarget.innerText);
          setEditing(false);
        } else {
          handleDeleteClick();
        }
      }
    },
    [handleDeleteClick, handleSaveClick, setEditing, task.content]
  );

  let handleBlur = useCallback((e: FocusEvent<HTMLDivElement>) => {
    setNewValue(e.currentTarget.innerText);
  }, []);

  let handleClearChanges = useCallback(() => {
    setNewValue(task.title);
  }, [task.title]);

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
      onDoubleClick={handleDoubleClick}
      onContextMenu={isMobile ? handleContextMenu : undefined}
    >
      <div
        ref={contentRef}
        className={clsx(
          "text-sm [&_a]:truncate [&_a]:block overflow-hidden px-1.5 py-1 -m-1",
          "flex-1 outline-0 rounded",
          {
            "cursor-text ring-1 ring-primary-500 whitespace-pre-line":
              isEditing,
            "select-none": !isEditing,
          }
        )}
        dangerouslySetInnerHTML={{
          __html: isEditing ? newValue || "" : task.content,
        }}
        contentEditable={isEditing}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
      <Group
        className={clsx({
          "items-center ml-auto": orientation === Orientation.VERTICAL,
          "items-end justify-end": orientation === Orientation.HORIZONTAL,
        })}
      >
        {(isUpdating || isRemoving) && <Loading className="w-4 h-4" />}
        {!isEditing && newValue !== task.title && (
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
