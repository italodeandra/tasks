import Button from "@italodeandra/ui/components/Button/Button";
import { ClockIcon } from "@heroicons/react/24/outline";
import { useTimesheetStart } from "../../../pages/api/timesheet/start";
import { useTimesheetStop } from "../../../pages/api/timesheet/stop";
import { MouseEvent, useCallback, useMemo } from "react";
import ms from "ms";
import { useInterval, useUpdate } from "react-use";
import clsx from "clsx";
import { TaskListApi } from "../../../pages/api/task/list";
import { prettyMilliseconds } from "../../../utils/prettyMilliseconds";
import Loading from "@italodeandra/ui/components/Loading";
import { isNil } from "lodash";
import { NextSeo } from "next-seo";

export function Timer({
  task,
  buttonVariant = "text",
  className,
}: {
  task: Pick<TaskListApi["Response"][number], "_id" | "timesheet">;
  buttonVariant?: "text" | "outlined";
  className?: string;
}) {
  const { mutate: start, isLoading: isStarting } = useTimesheetStart();
  const { mutate: stop, isLoading: isStopping } = useTimesheetStop();
  const isLoading = isStarting || isStopping;

  const currentClockIn = task.timesheet?.currentClockIn;

  const handleClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      if (currentClockIn) {
        stop();
      } else {
        start({ _id: task._id });
      }
    },
    [currentClockIn, start, stop, task._id]
  );

  const currentClockInTime = currentClockIn
    ? Date.now() - new Date(currentClockIn).getTime()
    : undefined;

  const time = currentClockIn ? currentClockInTime : task.timesheet?.totalTime;

  const rerender = useUpdate();
  useInterval(
    rerender,
    !isNil(currentClockInTime)
      ? ms(currentClockInTime < ms("1m") ? "1s" : "1m")
      : null
  );

  const buttonProps = useMemo(
    () =>
      !isNil(time)
        ? {
            leading: isLoading ? (
              <Loading className="w-4 h-4 text-inherit" />
            ) : (
              <ClockIcon className="shrink-0 w-4 h-4" />
            ),
            children: prettyMilliseconds(time),
          }
        : {
            icon: true,
            children: isLoading ? (
              <Loading className="w-4 h-4 text-inherit" />
            ) : (
              <ClockIcon className="shrink-0 w-4 h-4" />
            ),
          },
    [isLoading, time]
  );

  return (
    <>
      {!isNil(currentClockInTime) && (
        <NextSeo title={prettyMilliseconds(currentClockInTime)} />
      )}
      <Button
        size="xs"
        variant={buttonVariant}
        onClick={handleClick}
        data-no-dnd="true"
        color={!isNil(currentClockIn) ? "success" : undefined}
        className={clsx(
          "whitespace-nowrap p-1",
          {
            "px-1.5": !!time,
          },
          className
        )}
        {...buttonProps}
      />
    </>
  );
}
