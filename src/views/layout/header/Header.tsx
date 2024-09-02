import { UserSection } from "./user/UserSection";
import { ReactNode } from "react";
import Button from "@italodeandra/ui/components/Button/Button";
import clsx from "@italodeandra/ui/utils/clsx";
import stopPropagation from "@italodeandra/ui/utils/stopPropagation";
import Loading from "@italodeandra/ui/components/Loading";
import { Time } from "../../../components/Time";
import { StopIcon } from "@heroicons/react/20/solid";
import Tooltip from "@italodeandra/ui/components/Tooltip";
import { timesheetGetMyOverviewApi } from "../../../pages/api/timesheet/get-my-overview";
import { timesheetStartApi } from "../../../pages/api/timesheet/start";
import { timesheetStopApi } from "../../../pages/api/timesheet/stop";

function CurrentClock() {
  const timesheetGetMyOverview = timesheetGetMyOverviewApi.useQuery();
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
      <span>Today: </span>
      <Time value={timesheetGetMyOverview.data.todayTime} />
    </div>
  );
}

export function Header({ children }: { children?: ReactNode }) {
  return (
    <div className="sticky left-0 top-0 z-10 flex w-full gap-2 bg-zinc-950/70 p-2 backdrop-blur-lg transition-shadow scrolled:shadow">
      <div className="mb-auto flex min-h-8 items-center gap-2">
        <div className="text-2xl leading-none text-zinc-100">マ</div>
        <div className="font-mono text-sm leading-[normal] text-zinc-100">
          Tasks
        </div>
      </div>
      {children}
      <div className="grow" />
      <div className="mb-auto flex min-h-8 items-center gap-2 pr-1">
        <CurrentClock />
        <UserSection />
      </div>
    </div>
  );
}
