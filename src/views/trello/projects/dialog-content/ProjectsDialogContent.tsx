import { projectsDialogState } from "../projectsDialog.state";
import { useSnapshot } from "valtio";
import { ClientForm } from "./ClientForm";
import { ClientListWithProjects } from "./ClientListWithProjects";
import { ProjectForm } from "./ProjectForm";

export function ProjectsDialogContent() {
  const { route, query } = useSnapshot(projectsDialogState);

  if (route === "edit-project" && query) {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-lg font-medium leading-none text-zinc-900 dark:text-zinc-50">
          Edit {query.name}
        </div>
        <ProjectForm />
      </div>
    );
  }

  if (route === "new-project" && query) {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-lg font-medium leading-none text-zinc-900 dark:text-zinc-50">
          New project at {query.client?.name}
        </div>
        <ProjectForm />
      </div>
    );
  }

  if (route === "edit-client" && query) {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-lg font-medium leading-none text-zinc-900 dark:text-zinc-50">
          Edit {query.name}
        </div>
        <ClientForm />
      </div>
    );
  }

  if (route === "new-client") {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-lg font-medium leading-none text-zinc-900 dark:text-zinc-50">
          New client
        </div>
        <ClientForm />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-lg font-medium leading-none text-zinc-900 dark:text-zinc-50">
        Projects
      </div>
      <ClientListWithProjects />
    </div>
  );
}
