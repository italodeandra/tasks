import Group from "@italodeandra/ui/components/Group";
import clsx from "@italodeandra/ui/utils/clsx";
import dayjs from "dayjs";
import { Timer } from "./Timer";
import { useSnapshot } from "valtio";
import { homeState } from "../home.state";
import { Orientation } from "../kanban/Orientation";
import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Bars3BottomLeftIcon, ChatBubbleLeftIcon, EllipsisVerticalIcon, PencilIcon } from "@heroicons/react/16/solid";
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
import { useTimesheetStop } from "../../../pages/api/timesheet/stop";
import DropdownMenu from "@italodeandra/ui/components/DropdownMenu";

export default function Task(task: ITask) {
  const {
    orientation,
    selectedProjects,
    editingTasks,
    setEditingTasks,
    selectedClients
  } = useSnapshot(homeState);
  const { mutate: stop } = useTimesheetStop();

  const isEditing = editingTasks.includes(task._id);
  const setEditing = useCallback(
    (editing: boolean) => {
      setEditingTasks(
        editing
          ? [...editingTasks, task._id]
          : pull([...editingTasks], task._id)
      );
    },
    [editingTasks, setEditingTasks, task._id]
  );

  const [newValue, setNewValue] = useState(task.content);
  const isMobile = useMediaQuery(`(max-width: ${defaultTheme.screens.md})`);
  const [oneClicked, setOneClicked] = useState(false);
  const debouncedOneClicked = useDebouncedValue(oneClicked, "500ms");

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
        content: <TaskDetails _id={task._id} />
      });
    }
  }, [debouncedOneClicked, task._id]);

  const handleClick = useCallback(() => {
    if (!isEditing) {
      setOneClicked(true);
    }
  }, [isEditing]);

  const handleDoubleClick = useCallback(() => {
    setOneClicked(false);
    setEditing(true);
  }, [setEditing]);

  const { mutate: remove } = taskRemoveApi.useMutation();
  const handleDeleteClick = useCallback(() => {
    remove({
      _id: task._id
    });
  }, [remove, task._id]);
  const { mutate: update, isPending: isUpdating } = taskUpdateApi.useMutation();
  const handleSaveClick = useCallback(
    (newValue: string) => {
      setEditing(false);
      setNewValue(newValue);
      if (newValue) {
        update({
          _id: task._id,
          title: newValue
        });
      } else {
        if (!task.timesheet) {
          handleDeleteClick();
        }
      }
    },
    [handleDeleteClick, setEditing, task._id, task.timesheet, update]
  );

  const handleMoveStatusClick = useCallback(
    (status: TaskStatus) => () => {
      if (task.timesheet?.currentClockIn && status === TaskStatus.DONE) {
        stop();
      }
      update({
        _id: task._id,
        status,
        order: -1
      });
    },
    [stop, task._id, task.timesheet?.currentClockIn, update]
  );

  const handleClearChanges = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      setNewValue(task.content);
    },
    [task.content]
  );

  const dimmed = useMemo(() => {
    if (
      selectedProjects.length > 0 &&
      (!task.project?._id || !selectedProjects.includes(task.project?._id))
    ) {
      return true;
    }
    // noinspection RedundantIfStatementJS
    if (
      selectedClients.length > 0 &&
      (!task.client?._id || !selectedClients.includes(task.client?._id))
    ) {
      return true;
    }
    return false;
  }, [selectedProjects, selectedClients, task.project?._id, task.client?._id]);

  const taskClassName = clsx("w-full rounded bg-zinc-200 dark:bg-zinc-900", {
    "flex-col": orientation === Orientation.HORIZONTAL
  });

  const handleContextMenu = useCallback(
    (e: MouseEvent) => e.preventDefault(),
    []
  );

  const taskElement = (
    <Group
      className={clsx(taskClassName, "flex p-1 group overflow-hidden", {
        "opacity-40": dimmed,
        "gap-2": orientation === Orientation.VERTICAL,
        "gap-1": orientation === Orientation.HORIZONTAL
      })}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={isMobile ? handleContextMenu : undefined}
    >
      <Markdown
        value={task.content}
        className="text-sm flex-1 overflow-hidden px-0.5 [&_.task-list-item]:pl-0.5"
        onChange={handleSaveClick}
        editable
        loading={isUpdating}
        editing={isEditing}
        onChangeEditing={setEditing}
        inputClassName="-mx-1 -mt-[9px] -mb-[5px] pt-[4px]"
      />
      <Group
        className={clsx({
          "items-center ml-auto": orientation === Orientation.VERTICAL,
          "items-end justify-end": orientation === Orientation.HORIZONTAL
        })}
        wrap
      >
        {(task.description || task.comments) && (
          <>
            {task.description && (
              <Bars3BottomLeftIcon className="w-3 h-3 my-0.5" />
            )}
            {task.comments && (
              <Group className="items-center gap-1">
                <ChatBubbleLeftIcon className="w-3 h-3" />
                <div className="text-xs">{task.comments}</div>
              </Group>
            )}
          </>
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
          title={`Created at ${dayjs(task.createdAt).format("LLL")}`}
          className="text-zinc-500 text-xs whitespace-nowrap"
        >
          {dayjs(task.createdAt).fromNow(true)}
        </div>
        <Timer
          task={task}
          className={clsx("-m-1 transition", {
            "group-hover:opacity-100 opacity-50": !task.timesheet
          })}
        />
        {isMobile && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="text" size="xs" className="p-1 -m-1">
                <EllipsisVerticalIcon className="shrink-0 w-4 h-4" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {columns
                .filter((c) => c !== task.columnId)
                .map((status) => (
                  <DropdownMenu.Item
                    key={status}
                    onClick={handleMoveStatusClick(status)}
                  >
                    Move to {translateTaskStatus(status)}
                  </DropdownMenu.Item>
                ))}
              {!task.timesheet && (
                <DropdownMenu.Item onClick={handleDeleteClick}>
                  Delete
                </DropdownMenu.Item>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        )}
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
        {!task.timesheet && (
          <ContextMenu.Item onClick={handleDeleteClick}>
            Delete
          </ContextMenu.Item>
        )}
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
