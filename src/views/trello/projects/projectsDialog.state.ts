import { proxy } from "valtio";

export const projectsDialogState = proxy({
  route: "list" as
    | "list"
    | "new-project"
    | "new-client"
    | "edit-client"
    | "edit-project",
  expandedClients: [] as string[],
  query: null as {
    _id?: string;
    name?: string;
    client?: { _id: string; name: string } | null;
  } | null,
});
