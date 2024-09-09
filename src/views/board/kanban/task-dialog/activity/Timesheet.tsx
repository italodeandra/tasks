import formatTime from "@italodeandra/ui/utils/formatTime";
import { TaskActivityListApi } from "../../../../../pages/api/task-activity/list";
import ContextMenu from "@italodeandra/ui/components/ContextMenu";
import { useCallback } from "react";
import { timesheetDeleteApi } from "../../../../../pages/api/timesheet/delete";

export function Timesheet(activity: TaskActivityListApi["Response"][0]) {
  const timesheetDelete = timesheetDeleteApi.useMutation();

  const handleDeleteClick = useCallback(() => {
    timesheetDelete.mutate({
      _id: activity.data.timesheetId,
    });
  }, [activity.data.timesheetId, timesheetDelete]);

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <span>
          logged{" "}
          <span className="font-medium text-white">
            {formatTime(activity.data.time)}
          </span>{" "}
          of work on the task
          {activity.data.retroactive && " (retroactively)"}
        </span>
      </ContextMenu.Trigger>
      {activity.data.timesheetId && (
        <ContextMenu.Content>
          <ContextMenu.Item onClick={handleDeleteClick}>
            Delete timesheet
          </ContextMenu.Item>
        </ContextMenu.Content>
      )}
    </ContextMenu.Root>
  );
}
