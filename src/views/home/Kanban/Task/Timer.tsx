import Button from "@italodeandra/ui/components/Button/Button";
import { ClockIcon } from "@heroicons/react/24/outline";
import { useTimesheetStart } from "../../../../pages/api/timesheet/start";
import { useTimesheetStop } from "../../../../pages/api/timesheet/stop";
import { useCallback } from "react";
import ms from "ms";
import { useInterval, useUpdate } from "react-use";
import clsx from "clsx";
import { TaskListApiResponse } from "../../../../pages/api/task/list";
import { prettyMilliseconds } from "../../../../utils/prettyMilliseconds";

export function Timer({ task }: { task: TaskListApiResponse[0] }) {
  let { mutate: start, isLoading: isStarting } = useTimesheetStart();
  let { mutate: stop, isLoading: isStopping } = useTimesheetStop();
  let isLoading = isStarting || isStopping;

  let handleClick = useCallback(() => {
    if (task.timesheet?.currentClockIn) {
      stop(task);
    } else {
      start(task);
    }
  }, [start, stop, task]);

  let time =
    (task.timesheet?.time || 0) +
    (task.timesheet?.currentClockIn
      ? Date.now() - new Date(task.timesheet.currentClockIn).getTime()
      : 0);

  let rerender = useUpdate();
  useInterval(rerender, time ? ms("1s") : null);

  return (
    <Button
      size="sm"
      variant="outlined"
      loading={isLoading}
      onClick={handleClick}
      data-no-dnd="true"
      color={task.timesheet?.currentClockIn ? "success" : undefined}
      className={clsx({
        "opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100 group-focus:opacity-100":
          !time,
      })}
      {...(time
        ? {
            leading: <ClockIcon />,
            children: prettyMilliseconds(time),
          }
        : {
            icon: true,
            children: <ClockIcon />,
          })}
    />
  );
}
