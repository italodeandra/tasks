import { proxy } from "valtio";
import { Orientation } from "./kanban/Orientation";
import createStateHydration from "../../utils/createStateHydration";

export const homeState = proxy({
  showTimesheet: false,
  setShowTimesheet(show: boolean) {
    homeState.showTimesheet = show;
  },

  selectedProjects: [] as string[],
  setSelectedProjects(projects: string[]) {
    homeState.selectedProjects = projects;
  },

  selectedClients: [] as string[],
  setSelectedClients(clients: string[]) {
    homeState.selectedClients = clients;
  },

  orientation: Orientation.VERTICAL,
  setOrientation(orientation: Orientation) {
    homeState.orientation = orientation;
  },

  editingTasks: [] as string[],
  setEditingTasks(tasks: string[]) {
    homeState.editingTasks = tasks;
  },

  hiddenColumns: [] as string[],
  setHiddenColumns(columns: string[]) {
    homeState.hiddenColumns = columns;
  },
});

export const hydrateHomeState = createStateHydration("homeState", homeState);
