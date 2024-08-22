import ContextMenu from "@italodeandra/ui/components/ContextMenu";

export function TaskAdditionalActions({
  cardId,
  listId,
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
