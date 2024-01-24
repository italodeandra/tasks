import Group from "@italodeandra/ui/components/Group";
import { translateTaskStatus } from "../../../utils/translateTaskStatus";
import { AddTaskButton } from "./AddTaskButton";

function Column({ column, taskCount }: { column: string; taskCount: number }) {
  return (
    <Group>
      {translateTaskStatus(column)}
      <span className="text-zinc-500 font-light">{taskCount}</span>
      <div className="grow" />
      <AddTaskButton column={column} />
    </Group>
  );
}

export function renderColumn(column: string, taskCount: number) {
  return <Column column={column} taskCount={taskCount} />;
}
