import { useMemo } from "react";
import { clientListApi } from "../../../../pages/api/client/list";
import Button from "@italodeandra/ui/components/Button";
import DropdownMenu from "@italodeandra/ui/components/DropdownMenu";
import { useSnapshot } from "valtio";
import { homeState } from "../../../home/home.state";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Client } from "./Client";
import { newClientState } from "./new-client/newClient.state";

export default function Clients() {
  const { selectedClients, setSelectedClients } = useSnapshot(homeState);
  const { data: clients, isLoading: isLoading } = clientListApi.useQuery();

  const clientsWithNone = useMemo(
    () => [
      {
        _id: "NONE",
        name: "None",
      },
      ...(clients || []),
    ],
    [clients]
  );

  const selectedClientsNames = useMemo(
    () =>
      clientsWithNone
        .filter((p) => selectedClients.includes(p._id))
        .map((p) => p.name),
    [clientsWithNone, selectedClients]
  );

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button size="xs" loading={isLoading}>
          {selectedClients.length === 0 ||
          selectedClients.length === clientsWithNone.length
            ? "All clients"
            : `Client${
                selectedClientsNames.length === 1 ? "" : "s"
              }: ${selectedClientsNames.join(", ")}`}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.CheckboxItem
          checked={selectedClients.length === clientsWithNone.length}
          onClick={() => setSelectedClients([])}
        >
          All
        </DropdownMenu.CheckboxItem>
        {clientsWithNone.map((client) => (
          <Client key={client._id} {...client} />
        ))}
        <DropdownMenu.Item onClick={newClientState.openModal}>
          <DropdownMenu.ItemIndicator forceMount>
            <PlusIcon />
          </DropdownMenu.ItemIndicator>
          Create a new client
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
