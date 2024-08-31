import ContextMenu from "@italodeandra/ui/components/ContextMenu";

export function TaskAdditionalActions({
  cardId, // TODO
  listId, // TODO
}: {
  cardId: string;
  listId: string;
}) {
  return (
    <>
      <ContextMenu.Item>Assign to me</ContextMenu.Item>
    </>
  );
}
