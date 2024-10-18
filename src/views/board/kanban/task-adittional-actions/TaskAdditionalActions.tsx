import { AssignToMeContextMenuItem } from "./AssignToMeContextMenuItem";
import { ChangePriorityContextMenuItems } from "./ChangePriorityContextMenuItems";
import { CopyIdToClipboardMenuItem } from "./CopyIdToClipboardMenuItem";

export function TaskAdditionalActions({
  cardId,
  listId,
  boardId,
  canEdit,
}: {
  cardId: string;
  listId: string;
  boardId: string;
  canEdit?: boolean;
}) {
  return (
    <>
      <AssignToMeContextMenuItem
        boardId={boardId}
        cardId={cardId}
        listId={listId}
      />
      {canEdit && <ChangePriorityContextMenuItems taskId={cardId} />}
      <CopyIdToClipboardMenuItem taskId={cardId} />
    </>
  );
}
