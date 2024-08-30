import { useState } from "react";
import clsx from "@italodeandra/ui/utils/clsx";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/16/solid";
import Button from "@italodeandra/ui/components/Button";
import Checkbox from "@italodeandra/ui/components/Checkbox";
import stopPropagation from "@italodeandra/ui/utils/stopPropagation";
import { pullAll, remove, uniq, xor } from "lodash-es";
import { showDialog } from "@italodeandra/ui/components/Dialog";
import { ProjectsDialogContent } from "./dialog-content/ProjectsDialogContent";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import ContextMenu from "@italodeandra/ui/components/ContextMenu";
import { clientListWithProjectsApi } from "../../../pages/api/client/list-with-projects";

export function Projects({ boardId }: { boardId: string }) {
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  const clientListWithProjects = clientListWithProjectsApi.useQuery({
    boardId,
  });

  return (
    <div
      className={clsx("rounded-lg bg-white/[0.03] p-2 transition-colors", {
        "bg-white/10": !!selectedProjects.length,
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
            {(!!selectedProjects.length || !!selectedClients.length) && (
              <Button
                variant="text"
                size="xs"
                className="-my-1.5 ml-auto px-1 py-0.5"
                onClick={() => {
                  setSelectedClients([]);
                  setSelectedProjects([]);
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
                        setSelectedProjects(
                          uniq([...selectedProjects, "__NONE__"]),
                        );
                        setSelectedClients(
                          uniq([...selectedClients, "__NONE__"]),
                        );
                      } else {
                        setSelectedProjects(
                          xor(selectedProjects, ["__NONE__"]),
                        );
                        setSelectedClients(xor(selectedClients, ["__NONE__"]));
                      }
                    }}
                    checked={selectedProjects.includes("__NONE__")}
                  />
                  <span className="hover:text-white">None</span>
                </label>
              </div>
              {clientListWithProjects.data?.map((client) => (
                <Accordion.Root type="multiple" key={client._id}>
                  <Accordion.Item
                    value={client._id}
                    className="group/project flex flex-col gap-1 rounded-lg bg-black/20 p-2"
                  >
                    <Accordion.Trigger className="flex items-center gap-1.5 text-sm">
                      <Checkbox
                        onClick={stopPropagation}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedClients(
                              uniq([...selectedClients, client._id]),
                            );
                            setSelectedProjects(
                              uniq([
                                ...selectedProjects,
                                ...client.projects.map((p) => p._id),
                              ]),
                            );
                          } else {
                            setSelectedClients(
                              remove(selectedClients, client._id),
                            );
                            setSelectedProjects(
                              pullAll(
                                selectedProjects,
                                client.projects.map((p) => p._id),
                              ),
                            );
                          }
                        }}
                        checked={selectedClients.includes(client._id)}
                        indeterminate={
                          !selectedClients.includes(client._id) &&
                          client.projects.some((p) =>
                            selectedProjects.includes(p._id),
                          )
                        }
                      />
                      <ContextMenu.Root>
                        <ContextMenu.Trigger asChild>
                          <span className="hover:text-white">
                            {client.name}
                          </span>
                        </ContextMenu.Trigger>
                        <ContextMenu.Content>
                          <ContextMenu.Item
                            onClick={(e) => {
                              e.stopPropagation();
                              const dialogId = isomorphicObjectId().toString();
                              showDialog({
                                _id: dialogId,
                                title: `Edit ${client.name}`,
                                content: (
                                  <ProjectsDialogContent
                                    boardId={boardId}
                                    dialogId={dialogId}
                                    route="edit-client"
                                    query={{ ...client }}
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
                        {client.projects.map((project) => (
                          <label
                            key={project._id}
                            className="flex items-center gap-1.5 text-sm"
                          >
                            <Checkbox
                              checked={selectedProjects.includes(project._id)}
                              onChange={(e) => {
                                let newSelectedProjects = selectedProjects;
                                if (e.target.checked) {
                                  newSelectedProjects = [
                                    ...selectedProjects,
                                    project._id,
                                  ];
                                  setSelectedProjects(newSelectedProjects);
                                } else {
                                  newSelectedProjects = xor(selectedProjects, [
                                    project._id,
                                  ]);
                                  setSelectedProjects(newSelectedProjects);
                                }
                                if (
                                  client.projects.every((p) =>
                                    newSelectedProjects.includes(p._id),
                                  )
                                ) {
                                  setSelectedClients(
                                    uniq([...selectedClients, client._id]),
                                  );
                                } else {
                                  setSelectedClients(
                                    remove(selectedClients, client._id),
                                  );
                                }
                              }}
                            />
                            <ContextMenu.Root>
                              <ContextMenu.Trigger asChild>
                                <span>{project.name}</span>
                              </ContextMenu.Trigger>
                              <ContextMenu.Content>
                                <ContextMenu.Item
                                  onClick={() => {
                                    const dialogId =
                                      isomorphicObjectId().toString();
                                    showDialog({
                                      _id: dialogId,
                                      title: `Edit ${project.name}`,
                                      content: (
                                        <ProjectsDialogContent
                                          boardId={boardId}
                                          dialogId={dialogId}
                                          route="edit-project"
                                          query={{ ...project, client }}
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
                              title: `New project at ${client.name}`,
                              content: (
                                <ProjectsDialogContent
                                  boardId={boardId}
                                  dialogId={dialogId}
                                  route="new-project"
                                  query={{ client }}
                                />
                              ),
                            });
                          }}
                          leading={<PlusIcon className="mr-2" />}
                        >
                          New project
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
                    title: "New client",
                    content: (
                      <ProjectsDialogContent
                        boardId={boardId}
                        route="new-client"
                        dialogId={dialogId}
                      />
                    ),
                  });
                }}
                leading={<PlusIcon />}
              >
                New client
              </Button>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
}
