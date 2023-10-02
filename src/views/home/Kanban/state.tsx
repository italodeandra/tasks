import { proxy, subscribe } from "valtio";

export const state = proxy({
  selectedProjects: [] as string[],
  timesheetWidth: undefined as number | undefined,
});

try {
  Object.assign(state, JSON.parse(localStorage.getItem("state") as string));
} catch (e) {
  // do nothing
}

subscribe(state, () => {
  localStorage.setItem("state", JSON.stringify(state));
});
