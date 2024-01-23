import { TaskStatus } from "../collections/task";

export function translateTaskStatus(type: TaskStatus | string) {
  return (
    {
      [TaskStatus.DONE]: "Done",
      [TaskStatus.DOING]: "Doing",
      [TaskStatus.TODO]: "Todo",
      [TaskStatus.BLOCKED]: "Blocked",
    }[type] || type
  );
}
