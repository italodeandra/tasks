import Button from "@italodeandra/ui/components/Button/Button";
import { ClockIcon } from "@heroicons/react/24/outline";
import { ITask } from "../../../../collections/task";
import { useTaskTimesheetStart } from "../../../../pages/api/task/timesheet/start";
import { useTaskTimesheetStop } from "../../../../pages/api/task/timesheet/stop";
import { useCallback } from "react";
import ms from "ms";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import { useInterval, useUpdate } from "react-use";
import clsx from "clsx";

export function Timer({
  task,
}: {
  task: Jsonify<Pick<ITask, "_id" | "timesheet">>;
}) {
  let { mutate: start, isLoading: isStarting } = useTaskTimesheetStart();
  let { mutate: stop, isLoading: isStopping } = useTaskTimesheetStop();
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
  useInterval(rerender, time ? ms(time < ms("1m") ? "1s" : "1m") : null);

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
            leadingIcon: <ClockIcon />,
            children: ms(time),
          }
        : {
            icon: true,
            children: <ClockIcon />,
          })}
    />
  );
}
