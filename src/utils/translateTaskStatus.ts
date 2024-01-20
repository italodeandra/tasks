import { TaskStatus } from "../collections/task";

export function translateTaskStatus(type: TaskStatus) {
  return {
    [TaskStatus.DONE]: "Done",
    [TaskStatus.DOING]: "Doing",
    [TaskStatus.TODO]: "Todo",
    [TaskStatus.BLOCKED]: "Blocked",
  }[type];
}
