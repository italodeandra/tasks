import { ClientListApi } from "../../../../pages/api/client/list";
import { useSnapshot } from "valtio";
import { clientArchiveApi } from "../../../../pages/api/client/archive";
import ContextMenu from "@italodeandra/ui/components/ContextMenu";
import { pull } from "lodash-es";
import React, { useCallback } from "react";
import { homeState } from "../../../home/home.state";
import DropdownMenu from "@italodeandra/ui/components/DropdownMenu";

export function Client(
  client: Pick<ClientListApi["Response"][0], "_id" | "name">
) {
  const { selectedClients, setSelectedClients } = useSnapshot(homeState);
  const { mutate: archive } = clientArchiveApi.useMutation();

  const handleClientArchive = useCallback(() => {
    archive(client);
    setSelectedClients([...selectedClients.filter((p) => p !== client._id)]);
  }, [archive, client, selectedClients, setSelectedClients]);

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        <DropdownMenu.CheckboxItem
          key={client._id}
          checked={selectedClients.includes(client._id)}
          onCheckedChange={(checked) =>
            setSelectedClients(
              checked
                ? [...selectedClients, client._id]
                : pull([...selectedClients], client._id)
            )
          }
        >
          {client.name}
        </DropdownMenu.CheckboxItem>
      </ContextMenu.Trigger>

      <ContextMenu.Content>
        <ContextMenu.Item onSelect={handleClientArchive}>
          Archive
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
