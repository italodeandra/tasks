import { TaskStatus } from "./collections/task";

export const primaryColor = "#0091ff";
export const appName = "Tasks";
export const appDescription = "Manage your daily tasks";
export const appKeywords = "tasks";

export const columns = [
  TaskStatus.DOING,
  TaskStatus.BLOCKED,
  TaskStatus.TODO,
  TaskStatus.DONE,
];
