import Tooltip from "@italodeandra/ui/components/Tooltip";
import Button from "@italodeandra/ui/components/Button/Button";
import stopPropagation from "@italodeandra/ui/utils/stopPropagation";
import { ChevronDoubleUpIcon, PlayIcon } from "@heroicons/react/16/solid";
import { taskListApi } from "../../../pages/api/task/list";
import { useSnapshot } from "valtio";
import { boardState } from "../board.state";
import { Fragment, useMemo } from "react";
import getInitials from "@italodeandra/ui/utils/getInitials";
import { getColorForString } from "../../../components/ColorPicker/colors";
import { timesheetGetMyOverviewApi } from "../../../pages/api/timesheet/get-my-overview";
import { Time } from "../../../components/Time";
import clsx from "@italodeandra/ui/utils/clsx";
import { StopIcon } from "@heroicons/react/20/solid";
import { timesheetStartApi } from "../../../pages/api/timesheet/start";
import { timesheetStopApi } from "../../../pages/api/timesheet/stop";
import Loading from "@italodeandra/ui/components/Loading";
import Text from "@italodeandra/ui/components/Text";
import dayjs from "dayjs";
import Routes from "../../../Routes";

export function TaskAdditionalContent({
  cardId,
  boardId,
  canEdit,
}: {
  listId: string;
  cardId: string;
  boardId: string;
  dragging: boolean;
  canEdit?: boolean;
}) {
  const { selectedProjects, selectedSubProjects } = useSnapshot(boardState);
  const taskList = taskListApi.useQuery(
    {
      boardId,
      selectedProjects: selectedProjects as string[],
      selectedSubProjects: selectedSubProjects as string[],
    },
    {
      enabled: false,
    },
  );

  const task = useMemo(
    () =>
      taskList.data
        ?.find((list) => list.tasks?.some((task) => task._id === cardId))
        ?.tasks?.find((task) => task._id === cardId),
    [cardId, taskList.data],
  );

  const timesheetGetMyOverview = timesheetGetMyOverviewApi.useQuery(
    {
      startOfToday: dayjs().startOf("day").toISOString(),
      endOfToday: dayjs().endOf("day").toISOString(),
    },
    {
      enabled: canEdit && !!task?.assignees.length,
    },
  );
  const timesheetStart = timesheetStartApi.useMutation();
  const timesheetStop = timesheetStopApi.useMutation();

  if (
    !task ||
    (!task.assignees.length &&
      !task.project &&
      !task.subProject &&
      !task.status &&
      !task.dependencies?.length)
  ) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-end justify-end gap-2 px-3 pb-3">
      {!!task.dependencies?.length && (
        <div className="flex flex-wrap items-start justify-start rounded-lg bg-white/5 px-1.5 py-1 text-xs">
          <div className="mr-0.5 font-light">Depends on</div>
          {task.dependencies.map((dependency) => (
            <Tooltip
              key={dependency._id}
              content={`Column: ${dependency.column.title} - Status: ${dependency.status.title}`}
            >
              <Text
                variant="link"
                className="px-1 py-0 text-xs text-white decoration-white/30 hover:decoration-white"
                onClick={stopPropagation}
                href={Routes.Task(boardId, dependency._id)}
              >
                {dependency.title}
              </Text>
            </Tooltip>
          ))}
        </div>
      )}
      {task.priority && (
        <Tooltip content={`Priority ${task.priority}`}>
          <div className="flex items-center gap-0.5 rounded-lg bg-white/5 px-1.5 py-1 text-center text-xs text-zinc-300">
            <ChevronDoubleUpIcon className="-ml-1 h-4 w-4" />
            <span>{task.priority}</span>
          </div>
        </Tooltip>
      )}
      {task.status && (
        <div className="rounded-lg bg-white/5 px-1.5 py-1 text-center text-xs text-zinc-300">
          {task.status.title}
        </div>
      )}
      {(task.project || task.subProject) && (
        <div className="rounded-lg bg-white/5 px-1.5 py-1 text-center text-xs text-zinc-300">
          {[task.project?.name, task.subProject?.name]
            .filter(Boolean)
            .join(" · ")}
        </div>
      )}
      {task.assignees.map((assignee) => {
        const initials = getInitials(assignee.name || assignee.email);
        const userColor = getColorForString(assignee._id);
        return (
          <Fragment key={assignee._id}>
            {assignee.isMe ? (
              <Tooltip
                content={
                  !timesheetGetMyOverview.data?.currentTimesheet
                    ? "Start tracking time on this task"
                    : "Stop tracking time"
                }
              >
                <Button
                  variant="filled"
                  rounded
                  className={clsx(
                    "group/myself relative h-6 w-6 overflow-hidden border-none p-0 text-xs transition-none dark:bg-[--bg] dark:text-white dark:hover:bg-[--hover] dark:active:border-[--active-border]",
                    {
                      "w-auto min-w-6 px-1 dark:bg-green-700 dark:hover:bg-green-600":
                        timesheetGetMyOverview.data?.currentTimesheet
                          ?.taskId === cardId,
                    },
                  )}
                  style={
                    {
                      "--bg": !assignee.profilePicture
                        ? userColor["600"]
                        : undefined,
                      "--hover": userColor["500"],
                      "--active-border": userColor["400"],
                    } as Record<string, string>
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      timesheetGetMyOverview.data?.currentTimesheet?.taskId ===
                      cardId
                    ) {
                      timesheetStop.mutate();
                    } else {
                      timesheetStart.mutate({ taskId: cardId });
                    }
                  }}
                  onTouchStart={stopPropagation}
                  onMouseDown={stopPropagation}
                >
                  {timesheetStart.isPending ||
                  timesheetStop.isPending ||
                  timesheetGetMyOverview.isLoading ? (
                    <Loading />
                  ) : (
                    <>
                      {timesheetGetMyOverview.data?.currentTimesheet?.taskId ===
                      cardId ? (
                        <>
                          <span className="mr-1 hidden group-hover/myself:block">
                            <StopIcon className="h-4 w-4" />
                          </span>
                          <Time
                            from={
                              timesheetGetMyOverview.data.currentTimesheet
                                .startedAt
                            }
                            autoUpdate
                          />
                        </>
                      ) : (
                        <>
                          {!assignee.profilePicture ? (
                            <span className="group-hover/myself:hidden">
                              {initials}
                            </span>
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={assignee.profilePicture}
                              alt={assignee.name}
                              className="group-hover/myself:hidden"
                            />
                          )}
                          <span className="hidden group-hover/myself:block">
                            <PlayIcon className="h-4 w-4" />
                          </span>
                        </>
                      )}
                    </>
                  )}
                </Button>
              </Tooltip>
            ) : (
              <Tooltip content={assignee.name || assignee.email}>
                <div
                  className={clsx(
                    "flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-[--bg] p-0 text-xs text-white",
                    {
                      "ring-2 ring-green-700":
                        assignee.currentTimesheet?.taskId === cardId,
                    },
                  )}
                  style={
                    {
                      "--bg": getColorForString(assignee._id)["600"],
                    } as Record<string, string>
                  }
                >
                  {!assignee.profilePicture ? (
                    <span>{initials}</span>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={assignee.profilePicture}
                      alt={assignee.name}
                      className="group-hover/myself:hidden"
                    />
                  )}
                </div>
              </Tooltip>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
