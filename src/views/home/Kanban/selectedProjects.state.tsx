import { proxy } from "valtio";

export const selectedProjectsState = proxy({
  selectedProjects: [] as string[],
});
