import { TaskListApiResponse } from "../../../pages/api/task/list";

export type ITask = Omit<
  TaskListApiResponse[number],
  "status" | "order" | "titleHtml"
> & {
  index: number;
  content: string;
  columnId: string;
};