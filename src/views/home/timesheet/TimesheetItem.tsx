import { useInterval, useUpdate } from "react-use";
import ms from "ms";
import React from "react";
import { prettyMilliseconds } from "../../../utils/prettyMilliseconds";
import { TimesheetListFromProjectApi } from "../../../pages/api/timesheet/list-from-project";

export function TimesheetItem({
  timesheet,
}: {
  timesheet: TimesheetListFromProjectApi["Response"]["data"][0];
}) {
  const time =
    timesheet?.time ||
    (timesheet?.startedAt
      ? Date.now() - new Date(timesheet.startedAt).getTime()
      : 0);

  const rerender = useUpdate();
  useInterval(rerender, !timesheet?.time ? ms("1s") : null);

  return (
    <div className={!timesheet?.time ? "text-green-500" : undefined}>
      {prettyMilliseconds(time)}
    </div>
  );
}
