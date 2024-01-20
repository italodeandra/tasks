import Button from "@italodeandra/ui/components/Button/Button";
import { ClockIcon } from "@heroicons/react/24/outline";
import { useTimesheetStart } from "../../../pages/api/timesheet/start";
import { useTimesheetStop } from "../../../pages/api/timesheet/stop";
import { MouseEvent, useCallback } from "react";
import ms from "ms";
import { useInterval, useUpdate } from "react-use";
import clsx from "clsx";
import { TaskListApiResponse } from "../../../pages/api/task/list";
import { prettyMilliseconds } from "../../../utils/prettyMilliseconds";

export function Timer({
  task,
}: {
  task: Pick<TaskListApiResponse[0], "_id" | "timesheet">;
}) {
  let { mutate: start, isLoading: isStarting } = useTimesheetStart();
  let { mutate: stop, isLoading: isStopping } = useTimesheetStop();
  let isLoading = isStarting || isStopping;

  let handleClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      if (task.timesheet?.currentClockIn) {
        stop();
      } else {
        start(task);
      }
    },
    [start, stop, task]
  );

  let time = task.timesheet?.currentClockIn
    ? Date.now() - new Date(task.timesheet.currentClockIn).getTime()
    : task.timesheet?.totalTime || 0;

  let rerender = useUpdate();
  useInterval(rerender, time ? ms("1s") : null);

  return (
    <Button
      size="xs"
      variant="outlined"
      loading={isLoading}
      onClick={handleClick}
      data-no-dnd="true"
      color={task.timesheet?.currentClockIn ? "success" : undefined}
      className={clsx("whitespace-nowrap p-1", {
        "px-1.5": !!time,
      })}
      {...(time > 0
        ? {
            leading: <ClockIcon className="shrink-0 w-4 h-4" />,
            children: prettyMilliseconds(time),
          }
        : {
            icon: true,
            children: <ClockIcon className="shrink-0 w-4 h-4" />,
          })}
    />
  );
}
