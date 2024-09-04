import Tooltip from "@italodeandra/ui/components/Tooltip";
import Button from "@italodeandra/ui/components/Button/Button";
import stopPropagation from "@italodeandra/ui/utils/stopPropagation";
import { PlayIcon } from "@heroicons/react/16/solid";
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

  const timesheetGetMyOverview = timesheetGetMyOverviewApi.useQuery(undefined, {
    enabled: canEdit,
  });
  const timesheetStart = timesheetStartApi.useMutation();
  const timesheetStop = timesheetStopApi.useMutation();

  if (!task?.assignees.length) {
    return null;
  }

  return (
    <div className="flex justify-end gap-2 px-3 pb-3">
      {task.assignees.map((assignee) => {
        const initials = getInitials(assignee.name || assignee.email);
        const userColor = getColorForString(assignee._id);
        return (
          <Fragment key={assignee._id}>
            {assignee.isMe ? (
              <Tooltip
                content={
                  !timesheetGetMyOverview.data?.myCurrentClock
                    ? "Start tracking time on this task"
                    : "Stop tracking time"
                }
              >
                <Button
                  variant="filled"
                  rounded
                  className={clsx(
                    "group/myself pointer-events-auto relative h-6 w-6 p-0 text-xs dark:bg-[--bg] dark:text-white dark:hover:bg-[--hover] dark:active:border-[--active-border]",
                    {
                      "w-auto min-w-6 px-1 dark:bg-green-700 dark:hover:bg-green-600":
                        timesheetGetMyOverview.data?.myCurrentClock,
                    },
                  )}
                  style={
                    {
                      "--bg": userColor["600"],
                      "--hover": userColor["500"],
                      "--active-border": userColor["400"],
                    } as Record<string, string>
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    if (timesheetGetMyOverview.data?.myCurrentClock) {
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
                      {timesheetGetMyOverview.data?.myCurrentClock ? (
                        <>
                          <Time
                            from={timesheetGetMyOverview.data.myCurrentClock}
                            autoUpdate
                            short
                            className="group-hover/myself:hidden"
                          />
                          <span className="hidden group-hover/myself:block">
                            <StopIcon className="-mx-1 h-4 w-4" />
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="group-hover/myself:hidden">
                            {initials}
                          </span>
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
                    "pointer-events-auto flex h-6 w-6 items-center justify-center rounded-full bg-[--bg] p-0 text-xs text-white",
                    {
                      "border-2 border-green-700": assignee.currentlyClocking,
                    },
                  )}
                  style={
                    {
                      "--bg": getColorForString(assignee._id)["600"],
                    } as Record<string, string>
                  }
                >
                  {initials}
                </div>
              </Tooltip>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
