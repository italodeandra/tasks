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
import { ClockIcon } from "@heroicons/react/24/outline";
import Routes from "../../../Routes";
import dayjs from "dayjs";

export function CurrentClock() {
  const { data: user } = useAuthGetUser();

  const timesheetGetMyOverview = timesheetGetMyOverviewApi.useQuery(
    {
      today: dayjs().startOf("day").toISOString(),
    },
    {
      enabled: !!user,
    },
  );
  const timesheetStart = timesheetStartApi.useMutation();
  const timesheetStop = timesheetStopApi.useMutation();

  if (!timesheetGetMyOverview.data) {
    return null;
  }

  return (
    <>
      {timesheetGetMyOverview.data.currentTimesheet && (
        <Tooltip content="Stop tracking time">
          <Button
            variant="filled"
            rounded
            className={clsx(
              "group/myself pointer-events-auto relative h-6 w-6 p-0 text-xs dark:text-white",
              {
                "w-auto min-w-6 px-1 dark:bg-green-700 dark:hover:bg-green-600":
                  timesheetGetMyOverview.data?.currentTimesheet,
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
                <span className="mr-1 hidden group-hover/myself:block">
                  <StopIcon className="h-4 w-4" />
                </span>
                <Time
                  from={timesheetGetMyOverview.data.currentTimesheet.startedAt}
                  autoUpdate
                  showOnWindowTitle
                />
              </>
            )}
          </Button>
        </Tooltip>
      )}
      <Tooltip
        content={
          timesheetGetMyOverview.data.currentTimesheet
            ? "View current task"
            : undefined
        }
      >
        <Button
          variant="filled"
          className="rounded-lg py-1.5 text-xs font-normal text-zinc-200 disabled:opacity-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:active:border-zinc-700"
          leading={<ClockIcon className="h-4 w-4" />}
          href={
            timesheetGetMyOverview.data.currentTimesheet?.taskId
              ? Routes.Task(
                  timesheetGetMyOverview.data.currentTimesheet.boardId,
                  timesheetGetMyOverview.data.currentTimesheet.taskId,
                )
              : undefined
          }
          disabled={!timesheetGetMyOverview.data.currentTimesheet?.taskId}
        >
          <span className="mr-1 hidden font-semibold sm:inline">Today:</span>
          <Time value={timesheetGetMyOverview.data.todayTime?.total} />
        </Button>
      </Tooltip>
    </>
  );
}
