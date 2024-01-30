import React from "react";
import Loading from "@italodeandra/ui/components/Loading/Loading";
import Group from "@italodeandra/ui/components/Group/Group";
import { Timer } from "../../home/task/Timer";
import Text from "@italodeandra/ui/components/Text";
import { prettyMilliseconds } from "../../../utils/prettyMilliseconds";
import { timesheetStatusApi } from "../../../pages/api/timesheet/status";
import dayjs from "dayjs";

export function TimesheetStatus() {
  let { data, isLoading } = timesheetStatusApi.useQuery({
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
      {data.currentClock && (
        <Timer task={data.currentClock} buttonVariant="outlined" />
      )}
      {!!data.todayClockedTime && (
        <Text size="sm">
          Today: {prettyMilliseconds(data.todayClockedTime)}
        </Text>
      )}
    </Group>
  );
}
