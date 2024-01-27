import { TaskListApi } from "../../../pages/api/task/list";

export type ITask = Omit<
  TaskListApi["Response"][number],
  "status" | "order" | "titleHtml"
> & {
  index: number;
  content: string;
  columnId: string;
};
