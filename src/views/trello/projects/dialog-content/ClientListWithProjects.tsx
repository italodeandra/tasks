import { clientListWithProjectsApi } from "../../../../pages/api/client/list-with-projects";
import Table from "@italodeandra/ui/components/Table";
import Tooltip from "@italodeandra/ui/components/Tooltip";
import dayjs from "dayjs";
import fakeArray from "@italodeandra/ui/utils/fakeArray";
import Skeleton from "@italodeandra/ui/components/Skeleton";
import { projectsDialogState } from "../projectsDialog.state";
import {
  ChevronDownIcon,
  PencilIcon,
  PlusIcon,
} from "@heroicons/react/16/solid";
import { Fragment } from "react";
import clsx from "@italodeandra/ui/utils/clsx";
import { xor } from "lodash-es";
import { useSnapshot } from "valtio";
import Button from "@italodeandra/ui/components/Button";

export function ClientListWithProjects() {
  const { expandedClients } = useSnapshot(projectsDialogState);
  const { data, isLoading } = clientListWithProjectsApi.useQuery();

  return (
    <Table hideBorder className="-mx-4 -mb-4">
      <Table.Head>
        <Table.Row>
          <Table.Cell>Clients / Projects</Table.Cell>
          <Table.Cell>Updated at</Table.Cell>
          <Table.Cell />
        </Table.Row>
      </Table.Head>
      <Table.Body className="[&_tr:last-of-type]:border-b-0">
        {data?.map((client) => (
          <Fragment key={client._id}>
            <Table.Row
              onClick={() =>
                (projectsDialogState.expandedClients = xor(expandedClients, [
                  client._id,
                ]))
              }
              className={clsx({
                "opacity-50":
                  expandedClients.length &&
                  !expandedClients.includes(client._id),
                "bg-white/5 dark:hover:bg-white/10": expandedClients.includes(
                  client._id,
                ),
              })}
            >
              <Table.Cell>{client.name}</Table.Cell>
              <Table.Cell>
                <Tooltip content={dayjs(client.updatedAt).format("LLL")}>
                  <span>{dayjs(client.updatedAt).fromNow()}</span>
                </Tooltip>
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="text"
                    icon
                    rounded
                    size="xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      projectsDialogState.route = "edit-client";
                      projectsDialogState.query = client;
                    }}
                  >
                    <PencilIcon />
                  </Button>
                  <ChevronDownIcon
                    className={clsx("h-4 w-4 transition-transform", {
                      "rotate-180": expandedClients.includes(client._id),
                    })}
                  />
                </div>
              </Table.Cell>
            </Table.Row>
            {expandedClients.includes(client._id) && (
              <Fragment>
                {client.projects.map((project) => (
                  <Table.Row
                    key={project._id}
                    className="bg-white/5 dark:hover:bg-white/10"
                    onClick={() => {
                      projectsDialogState.route = "edit-project";
                      projectsDialogState.query = project;
                    }}
                  >
                    <Table.Cell>
                      <span className="pl-4">{project.name}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <Tooltip content={dayjs(project.updatedAt).format("LLL")}>
                        <span>{dayjs(project.updatedAt).fromNow()}</span>
                      </Tooltip>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="text"
                          icon
                          rounded
                          size="xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            projectsDialogState.route = "edit-project";
                            projectsDialogState.query = project;
                          }}
                        >
                          <PencilIcon />
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
                <Table.Row
                  onClick={() => {
                    projectsDialogState.route = "new-project";
                    projectsDialogState.query = { client };
                  }}
                  className="bg-white/5 dark:hover:bg-white/10"
                >
                  <Table.Cell colSpan={3} className="!text-zinc-400">
                    <div className="flex items-center gap-1 pl-4">
                      <PlusIcon className="-ml-1 h-5 w-5" />
                      <span>Add new project to {client.name}</span>
                    </div>
                  </Table.Cell>
                </Table.Row>
              </Fragment>
            )}
          </Fragment>
        ))}
        {isLoading && (
          <Table.Row>
            {fakeArray(3).map((key) => (
              <Table.Cell key={key}>
                <Skeleton className="h-3" />
              </Table.Cell>
            ))}
          </Table.Row>
        )}
        {!isLoading && !data?.length && (
          <Table.Row>
            <Table.Cell colSpan={3} className="!text-zinc-500">
              No clients
            </Table.Cell>
          </Table.Row>
        )}
        <Table.Row
          onClick={() => {
            projectsDialogState.route = "new-client";
          }}
          className={clsx({
            "opacity-50": expandedClients.length,
          })}
        >
          <Table.Cell colSpan={3} className="!text-zinc-500">
            <div className="flex items-center gap-1">
              <PlusIcon className="-ml-1 h-5 w-5" />
              <span>Add new client</span>
            </div>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
}
