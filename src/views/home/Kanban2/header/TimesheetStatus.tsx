import React, { useState } from "react";
import { useTimesheetStatus } from "../../../../pages/api/timesheet/status";
import Loading from "@italodeandra/ui/components/Loading/Loading";
import Group from "@italodeandra/ui/components/Group/Group";
import { Timer } from "../../task/Timer";
import Text from "@italodeandra/ui/components/Text";
import { prettyMilliseconds } from "../../../../utils/prettyMilliseconds";

export function TimesheetStatus() {
  let { data, isLoading } = useTimesheetStatus();

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
