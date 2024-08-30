import { ClientForm } from "./ClientForm";
import { ProjectForm } from "./ProjectForm";

export function ProjectsDialogContent({
  boardId,
  dialogId,
  route,
  query,
}: {
  boardId: string;
  dialogId: string;
  route: "new-project" | "new-client" | "edit-client" | "edit-project";
  query?: {
    _id?: string;
    name?: string;
    client?: { _id: string; name: string };
  };
}) {
  if (route === "edit-project" && query) {
    return <ProjectForm dialogId={dialogId} query={query} />;
  }

  if (route === "new-project" && query) {
    return <ProjectForm dialogId={dialogId} query={query} />;
  }

  if (route === "edit-client" && query) {
    return <ClientForm dialogId={dialogId} query={query} boardId={boardId} />;
  }

  if (route === "new-client") {
    return <ClientForm dialogId={dialogId} query={query} boardId={boardId} />;
  }
}
