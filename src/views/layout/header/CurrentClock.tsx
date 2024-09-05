import { useAuthGetUser } from "@italodeandra/auth/api/getUser";
import { timesheetGetMyOverviewApi } from "../../../pages/api/timesheet/get-my-overview";
import { timesheetStartApi } from "../../../pages/api/timesheet/start";
import { timesheetStopApi } from "../../../pages/api/timesheet/stop";
import Tooltip from "@italodeandra/ui/components/Tooltip";
import Button from "@italodeandra/ui/components/Button/Button";
import clsx from "@italodeandra/ui/utils/clsx";
import stopPropagation from "@italodeandra/ui/utils/stopPropagation";
import Loading from "@italodeandra/ui/components/Loading";
import { Time } from "../../../components/Time";
import { StopIcon } from "@heroicons/react/20/solid";

export function CurrentClock() {
  const { data: user } = useAuthGetUser();

  const timesheetGetMyOverview = timesheetGetMyOverviewApi.useQuery(undefined, {
    enabled: !!user,
  });
  const timesheetStart = timesheetStartApi.useMutation();
  const timesheetStop = timesheetStopApi.useMutation();

  if (!timesheetGetMyOverview.data) {
    return null;
  }

  return timesheetGetMyOverview.data.myCurrentClock ? (
    <Tooltip content="Stop tracking time">
      <Button
        variant="filled"
        rounded
        className={clsx(
          "group/myself pointer-events-auto relative h-6 w-6 p-0 text-xs dark:text-white",
          {
            "w-auto min-w-6 px-1 dark:bg-green-700 dark:hover:bg-green-600":
              timesheetGetMyOverview.data?.myCurrentClock,
          },
        )}
        onClick={(e) => {
          e.stopPropagation();
          timesheetStop.mutate();
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
        )}
      </Button>
    </Tooltip>
  ) : (
    <div className="rounded-lg bg-zinc-900 px-2 py-1.5 text-xs">
      <span className="hidden sm:inline">Today: </span>
      <Time value={timesheetGetMyOverview.data.todayTime} />
    </div>
  );
}
