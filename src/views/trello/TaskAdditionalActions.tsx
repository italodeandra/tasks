import ContextMenu from "@italodeandra/ui/components/ContextMenu";

export function TaskAdditionalActions({ cardId }: { cardId: string }) {
  return (
    <>
      <ContextMenu.Item>Assign to me</ContextMenu.Item>
    </>
  );
}