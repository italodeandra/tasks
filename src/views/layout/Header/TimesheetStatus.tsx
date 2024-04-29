import React from "react";
import Loading from "@italodeandra/ui/components/Loading/Loading";
import Group from "@italodeandra/ui/components/Group/Group";
import { Timer } from "../../home/task/Timer";
import Text from "@italodeandra/ui/components/Text";
import { prettyMilliseconds } from "../../../utils/prettyMilliseconds";
import { timesheetStatusApi } from "../../../pages/api/timesheet/status";
import dayjs from "dayjs";
import { ClockIcon } from "@heroicons/react/24/outline";
import Tooltip from "@italodeandra/ui/components/Tooltip";

export function TimesheetStatus() {
  const { data, isLoading } = timesheetStatusApi.useQuery({
    today: dayjs().startOf("day").toDate().toISOString(),
  });

  if (isLoading) {
    return <Loading className="my-auto" />;
  }

  if (!data || (!data.todayClockedTime && !data.currentClock)) {
    return null;
  }

  return (
    <Group className="items-center">
      {data.currentClock ? (
        <Timer task={data.currentClock} buttonVariant="outlined" />
      ) : (
        data.todayClockedTime && (
          <Tooltip
            content={`Time clocked today: ${prettyMilliseconds(
              data.todayClockedTime
            )}`}
          >
            <Text
              size="sm"
              className="whitespace-nowrap flex items-center gap-1"
            >
              <ClockIcon className="shrink-0 w-4 h-4" />{" "}
              {prettyMilliseconds(data.todayClockedTime)}
            </Text>
          </Tooltip>
        )
      )}
    </Group>
  );
}
