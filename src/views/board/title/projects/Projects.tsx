import clsx from "@italodeandra/ui/utils/clsx";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/16/solid";
import Button from "@italodeandra/ui/components/Button";
import Checkbox from "@italodeandra/ui/components/Checkbox";
import stopPropagation from "@italodeandra/ui/utils/stopPropagation";
import { pull, pullAll, remove, uniq, xor } from "lodash-es";
import { showDialog } from "@italodeandra/ui/components/Dialog";
import { ProjectsDialogContent } from "./dialog-content/ProjectsDialogContent";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import ContextMenu from "@italodeandra/ui/components/ContextMenu";
import { projectListWithSubProjectsApi } from "../../../../pages/api/project/list-with-sub-projects";
import { useSnapshot } from "valtio";
import { boardState } from "../../board.state";
import Skeleton from "@italodeandra/ui/components/Skeleton";

export function Projects({ boardId }: { boardId: string }) {
  const { selectedProjects, selectedSubProjects } = useSnapshot(boardState);

  const projectListWithSubProjects = projectListWithSubProjectsApi.useQuery({
    boardId,
  });

  if (projectListWithSubProjects.isLoading) {
    return <Skeleton className="h-[32px] w-[87px] dark:bg-white/10" />;
  }

  return (
    <div
      className={clsx("rounded-lg bg-white/[0.03] p-2 transition-colors", {
        "bg-white/10":
          !!selectedSubProjects.length || !!selectedProjects.length,
      })}
    >
      <Accordion.Root type="multiple">
        <Accordion.Item
          value="projects"
          className="group whitespace-nowrap text-zinc-300"
        >
          <div className="flex items-center gap-1.5">
            <Accordion.Trigger className="flex items-center gap-1 pl-1 text-xs">
              <span className="font-medium hover:text-white">Projects</span>
              <ChevronDownIcon className="h-4 w-4 group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
            {(!!selectedSubProjects.length || !!selectedProjects.length) && (
              <Button
                variant="text"
                size="xs"
                className="-my-1.5 ml-auto px-1 py-0.5"
                onClick={() => {
                  boardState.selectedProjects = [];
                  boardState.selectedSubProjects = [];
                }}
              >
                Clear
              </Button>
            )}
          </div>
          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-collapse data-[state=open]:animate-expand">
            <div className="flex flex-wrap items-start gap-1 pt-1">
              <div className="flex flex-col gap-1 rounded-lg bg-black/20 p-2">
                <label className="flex items-center gap-1.5 text-sm">
                  <Checkbox
                    onClick={stopPropagation}
                    onChange={(e) => {
                      if (e.target.checked) {
                        boardState.selectedSubProjects = uniq([
                          ...selectedSubProjects,
                        ]);
                        boardState.selectedProjects = uniq([
                          ...selectedProjects,
                          "__NONE__",
                        ]);
                      } else {
                        boardState.selectedSubProjects =
                          xor(selectedSubProjects);
                        boardState.selectedProjects = xor(selectedProjects, [
                          "__NONE__",
                        ]);
                      }
                    }}
                    checked={selectedProjects.includes("__NONE__")}
                  />
                  <span className="hover:text-white">None</span>
                </label>
              </div>
              {projectListWithSubProjects.data?.map((project) => (
                <Accordion.Root type="multiple" key={project._id}>
                  <Accordion.Item
                    value={project._id}
                    className="group/project flex flex-col gap-1 rounded-lg bg-black/20 p-2"
                  >
                    <Accordion.Trigger className="flex items-center gap-1.5 text-sm">
                      <Checkbox
                        onClick={stopPropagation}
                        onChange={(e) => {
                          if (e.target.checked) {
                            boardState.selectedProjects = uniq([
                              ...boardState.selectedProjects,
                              project._id,
                            ]);
                            boardState.selectedSubProjects = uniq([
                              ...boardState.selectedSubProjects,
                              ...project.subProjects.map((p) => p._id),
                            ]);
                          } else {
                            boardState.selectedProjects = pull(
                              [...boardState.selectedProjects],
                              project._id,
                            );
                            boardState.selectedSubProjects = pullAll(
                              [...boardState.selectedSubProjects],
                              project.subProjects.map((p) => p._id),
                            );
                          }
                        }}
                        checked={selectedProjects.includes(project._id)}
                        indeterminate={
                          !selectedProjects.includes(project._id) &&
                          project.subProjects.some((p) =>
                            selectedSubProjects.includes(p._id),
                          )
                        }
                      />
                      <ContextMenu.Root>
                        <ContextMenu.Trigger asChild>
                          <span className="hover:text-white">
                            {project.name}
                          </span>
                        </ContextMenu.Trigger>
                        <ContextMenu.Content>
                          <ContextMenu.Item
                            onClick={(e) => {
                              e.stopPropagation();
                              const dialogId = isomorphicObjectId().toString();
                              showDialog({
                                _id: dialogId,
                                title: `Edit ${project.name}`,
                                content: (
                                  <ProjectsDialogContent
                                    boardId={boardId}
                                    dialogId={dialogId}
                                    route="edit-project"
                                    query={project}
                                  />
                                ),
                              });
                            }}
                          >
                            Edit
                          </ContextMenu.Item>
                        </ContextMenu.Content>
                      </ContextMenu.Root>
                      <ChevronDownIcon className="-ml-0.5 h-4 w-4 group-data-[state=open]/project:rotate-180" />
                    </Accordion.Trigger>
                    <Accordion.Content className="overflow-hidden data-[state=closed]:animate-collapse data-[state=open]:animate-expand">
                      <div className="flex flex-col gap-1 rounded-lg bg-white/[0.01] p-2">
                        {project.subProjects.map((subProject) => (
                          <label
                            key={subProject._id}
                            className="flex items-center gap-1.5 text-sm"
                          >
                            <Checkbox
                              checked={selectedSubProjects.includes(
                                subProject._id,
                              )}
                              onChange={(e) => {
                                let newSelectedSubProjects =
                                  selectedSubProjects as string[];
                                if (e.target.checked) {
                                  newSelectedSubProjects = [
                                    ...selectedSubProjects,
                                    subProject._id,
                                  ];
                                  boardState.selectedSubProjects =
                                    newSelectedSubProjects;
                                } else {
                                  newSelectedSubProjects = xor(
                                    selectedSubProjects,
                                    [subProject._id],
                                  );
                                  boardState.selectedSubProjects =
                                    newSelectedSubProjects;
                                }
                                if (
                                  project.subProjects.every((p) =>
                                    newSelectedSubProjects.includes(p._id),
                                  )
                                ) {
                                  boardState.selectedProjects = uniq([
                                    ...selectedProjects,
                                    project._id,
                                  ]);
                                } else {
                                  boardState.selectedProjects = remove(
                                    selectedProjects,
                                    project._id,
                                  );
                                }
                              }}
                            />
                            <ContextMenu.Root>
                              <ContextMenu.Trigger asChild>
                                <span>{subProject.name}</span>
                              </ContextMenu.Trigger>
                              <ContextMenu.Content>
                                <ContextMenu.Item
                                  onClick={() => {
                                    const dialogId =
                                      isomorphicObjectId().toString();
                                    showDialog({
                                      _id: dialogId,
                                      title: `Edit ${subProject.name}`,
                                      content: (
                                        <ProjectsDialogContent
                                          boardId={boardId}
                                          dialogId={dialogId}
                                          route="edit-sub-project"
                                          query={{ ...subProject, project }}
                                        />
                                      ),
                                    });
                                  }}
                                >
                                  Edit
                                </ContextMenu.Item>
                              </ContextMenu.Content>
                            </ContextMenu.Root>
                          </label>
                        ))}
                        <Button
                          variant="text"
                          size="xs"
                          className="-mx-1 -mb-1 justify-start rounded-lg py-[2px] pl-[7px] pr-2 text-left text-zinc-400"
                          onClick={() => {
                            const dialogId = isomorphicObjectId().toString();
                            showDialog({
                              _id: dialogId,
                              title: `New sub project at ${project.name}`,
                              content: (
                                <ProjectsDialogContent
                                  boardId={boardId}
                                  dialogId={dialogId}
                                  route="new-sub-project"
                                  query={{ project }}
                                />
                              ),
                            });
                          }}
                          leading={<PlusIcon className="mr-2" />}
                        >
                          Sub project
                        </Button>
                      </div>
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion.Root>
              ))}
              <Button
                variant="text"
                size="sm"
                className="rounded-lg py-[7px] text-zinc-400"
                onClick={() => {
                  const dialogId = isomorphicObjectId().toString();
                  showDialog({
                    _id: dialogId,
                    title: "New project",
                    content: (
                      <ProjectsDialogContent
                        boardId={boardId}
                        route="new-project"
                        dialogId={dialogId}
                      />
                    ),
                  });
                }}
                leading={<PlusIcon />}
              >
                Project
              </Button>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
}
