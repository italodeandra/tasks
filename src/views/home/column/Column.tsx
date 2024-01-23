import Group from "@italodeandra/ui/components/Group";
import { translateTaskStatus } from "../../../utils/translateTaskStatus";
import { AddTaskButton } from "./AddTaskButton";

function Column({ column }: { column: string }) {
  return (
    <Group className="justify-between">
      {translateTaskStatus(column)}
      <AddTaskButton column={column} />
    </Group>
  );
}

export function renderColumn(column: string) {
  return <Column column={column} />;
}
