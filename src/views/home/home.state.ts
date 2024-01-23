import { proxy } from "valtio";
import { Orientation } from "./kanban/Orientation";

export const homeState = proxy({
  selectedProjects: [] as string[],
  setOrientation(orientation: Orientation) {
    homeState.orientation = orientation;
  },

  orientation: Orientation.VERTICAL,
  setSelectedProjects(projects: string[]) {
    homeState.selectedProjects = projects;
  },
});
