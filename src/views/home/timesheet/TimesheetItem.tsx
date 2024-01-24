import { TimesheetListFromProjectApiResponse } from "../../../pages/api/timesheet/list-from-project";
import { useInterval, useUpdate } from "react-use";
import ms from "ms";
import React from "react";
import { prettyMilliseconds } from "../../../utils/prettyMilliseconds";

export function TimesheetItem({
  timesheet,
}: {
  timesheet: TimesheetListFromProjectApiResponse["data"][0];
}) {
  let time =
    timesheet?.time ||
    (timesheet?.startedAt
      ? Date.now() - new Date(timesheet.startedAt).getTime()
      : 0);

  let rerender = useUpdate();
  useInterval(rerender, !timesheet?.time ? ms("1s") : null);

  return (
    <div className={!timesheet?.time ? "text-green-500" : undefined}>
      {prettyMilliseconds(time)}
    </div>
  );
}
