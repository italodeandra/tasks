import { ProjectForm } from "./ProjectForm";
import { SubProjectForm } from "./SubProjectForm";

export function ProjectsDialogContent({
  boardId,
  dialogId,
  route,
  query,
}: {
  boardId: string;
  dialogId: string;
  route:
    | "new-sub-project"
    | "new-project"
    | "edit-project"
    | "edit-sub-project";
  query?: {
    _id?: string;
    name?: string;
    project?: { _id: string; name: string };
  };
}) {
  if (route === "edit-sub-project" && query) {
    return <SubProjectForm dialogId={dialogId} query={query} />;
  }

  if (route === "new-sub-project" && query) {
    return <SubProjectForm dialogId={dialogId} query={query} />;
  }

  if (route === "edit-project" && query) {
    return <ProjectForm dialogId={dialogId} query={query} boardId={boardId} />;
  }

  if (route === "new-project") {
    return <ProjectForm dialogId={dialogId} query={query} boardId={boardId} />;
  }
}
