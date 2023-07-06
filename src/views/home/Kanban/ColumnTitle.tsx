import { TaskStatus } from "../../../collections/task";
import { useTaskIsUpserting } from "../../../pages/api/task/upsert";
import Text from "@italodeandra/ui/components/Text/Text";
import { translateTaskStatus } from "./translateTaskStatus";
import Loading from "@italodeandra/ui/components/Loading/Loading";
import React from "react";

export function ColumnTitle({
  status,
  isLoading,
}: {
  status: TaskStatus;
  isLoading: boolean;
}) {
  let isUpserting = useTaskIsUpserting();
  isLoading = isLoading || isUpserting;
  return (
    <Text variant="label" className="flex gap-2">
      {translateTaskStatus(status)}
      {isLoading && <Loading />}
    </Text>
  );
}
