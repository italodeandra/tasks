import { proxy } from "valtio";
import { Orientation } from "./kanban/Orientation";
import createStateHydration from "../../utils/createStateHydration";

export const homeState = proxy({
  showTimesheet: false,
  setShowTimesheet(show: boolean) {
    homeState.showTimesheet = show;
  },

  selectedProjects: [] as string[],
  setOrientation(orientation: Orientation) {
    homeState.orientation = orientation;
  },

  orientation: Orientation.VERTICAL,
  setSelectedProjects(projects: string[]) {
    homeState.selectedProjects = projects;
  },

  editingTasks: [] as string[],
  setEditingTasks(tasks: string[]) {
    homeState.editingTasks = tasks;
  },
});

export const hydrateHomeState = createStateHydration("homeState", homeState);
