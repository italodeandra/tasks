import Button from "@italodeandra/ui/components/Button";
import { PlayIcon, StopIcon } from "@heroicons/react/20/solid";
import { timesheetGetTaskOverviewApi } from "../../../../pages/api/timesheet/get-task-overview";
import { timesheetStartApi } from "../../../../pages/api/timesheet/start";
import { ClockIcon } from "@heroicons/react/16/solid";
import Tooltip from "@italodeandra/ui/components/Tooltip";
import { timesheetStopApi } from "../../../../pages/api/timesheet/stop";
import clsx from "@italodeandra/ui/utils/clsx";
import { UserAvatar } from "../../../../components/UserAvatar";
import { Time } from "../../../../components/Time";

export function Timesheet({ taskId }: { taskId: string }) {
  const timesheetGetTaskOverview = timesheetGetTaskOverviewApi.useQuery({
    taskId,
  });

  const timesheetStart = timesheetStartApi.useMutation();
  const timesheetStop = timesheetStopApi.useMutation();

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium">Timesheet</div>
      <div className="flex flex-wrap gap-2">
        <Tooltip
          content={
            !timesheetGetTaskOverview.data?.currentUserClock
              ? "Start tracking time on this task"
              : "Stop tracking time"
          }
        >
          <Button
            rounded
            size="sm"
            className={clsx("group h-[34px] gap-2", {
              "bg-green-700": timesheetGetTaskOverview.data?.currentUserClock,
            })}
            {...(timesheetGetTaskOverview.data?.currentUserClock
              ? {
                  variant: "filled",
                  color: "success",
                  onClick: () => timesheetStop.mutate(),
                }
              : {
                  onClick: () => timesheetStart.mutate({ taskId }),
                })}
            loading={timesheetStart.isPending || timesheetStop.isPending}
          >
            {timesheetGetTaskOverview.data?.currentUserClock ? (
              <>
                <ClockIcon className="h-4 w-4 group-hover:hidden" />
                <StopIcon className="hidden h-4 w-4 group-hover:block" />
                <Time
                  from={timesheetGetTaskOverview.data.currentUserClock}
                  autoUpdate
                />
              </>
            ) : (
              <PlayIcon className="h-4 w-4" />
            )}
          </Button>
        </Tooltip>
        {timesheetGetTaskOverview.data?.users.map((userTimesheet) => (
          <div
            key={userTimesheet.user._id}
            className={clsx(
              "flex h-[34px] items-center rounded-full border-2 border-l-0 border-transparent bg-white/[0.05]",
              {
                "border-green-700": userTimesheet.currentClock,
              },
            )}
          >
            <UserAvatar
              className="h-[34px] w-[34px] text-sm"
              {...userTimesheet.user}
            />
            <div className="pl-2 pr-3">
              {userTimesheet.currentClock ? (
                <Time from={userTimesheet.currentClock} autoUpdate />
              ) : (
                <Time value={userTimesheet.timeClocked} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
