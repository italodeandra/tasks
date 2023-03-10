import { TaskStatus } from "../../../collections/task";

export function translateTaskStatus(status: TaskStatus) {
  return {
    [TaskStatus.TODO]: "To-do",
    [TaskStatus.DOING]: "Doing",
    [TaskStatus.DONE]: "Done",
  }[status];
}
