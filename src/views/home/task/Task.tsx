import Group from "@italodeandra/ui/components/Group";
import clsx from "@italodeandra/ui/utils/clsx";
import dayjs from "dayjs";
import { Timer } from "./Timer";
import { TaskListApiResponse } from "../../../pages/api/task/list";
import { useSnapshot } from "valtio";
import { homeState } from "../home.state";
import { Orientation } from "../kanban/Orientation";
import {
  FocusEvent,
  KeyboardEvent,
  useCallback,
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

export type ITask = Omit<
  TaskListApiResponse[number],
  "status" | "order" | "titleHtml"
> & {
  index: number;
  content: string;
  columnId: string;
};

function Task(task: ITask) {
  let { orientation, selectedProjects } = useSnapshot(homeState);
  let [isEditing, setEditing] = useState(!task.content);
  let [newValue, setNewValue] = useState(task.title);
  let contentRef = useRef<HTMLDivElement>(null);

  let handleDoubleClick = useCallback(() => {
    setEditing(true);
    setTimeout(() => contentRef.current?.focus());
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
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        setNewValue(e.currentTarget.innerText);
        e.preventDefault();
        handleSaveClick();
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
    [handleDeleteClick, handleSaveClick, task.content]
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

  // if (isEditing) {
  //   return (
  //     <Textarea
  //       className={clsx(taskClassName)}
  //       innerClassName=""
  //       inputClassName="border-0 rounded bg-transparent py-1 px-1.5 ring-1 transition"
  //       value={newValue}
  //       onChange={(e) => setNewValue(e.target.value)}
  //       autoFocus
  //       onKeyDown={handleKeyDown}
  //       trailing={
  //         isUpdating || isRemoving ? (
  //           <Loading />
  //         ) : (
  //           <PencilIcon className="w-5 h-5" />
  //         )
  //       }
  //       trailingClassName="items-start pt-1 pr-1"
  //     />
  //   );
  // }

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        <Group
          className={clsx(taskClassName, "flex p-1 group", {
            "opacity-40": dimmed,
            "gap-2": orientation === Orientation.VERTICAL,
            "gap-1": orientation === Orientation.HORIZONTAL,
          })}
          onDoubleClick={handleDoubleClick}
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
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item onClick={handleDeleteClick}>Delete</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}

export function renderTask(item: ITask) {
  return <Task {...item} />;
}
