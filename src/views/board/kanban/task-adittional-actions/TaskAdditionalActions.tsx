import { AssignToMeContextMenuItem } from "./AssignToMeContextMenuItem";
import { ChangePriorityContextMenuItems } from "./ChangePriorityContextMenuItems";
import { CopyIdToClipboardMenuItem } from "./CopyIdToClipboardMenuItem";
import { ChangeStatusContextMenuItems } from "./ChangeStatusContextMenuItems";

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
      <CopyIdToClipboardMenuItem taskId={cardId} />
      <AssignToMeContextMenuItem
        boardId={boardId}
        cardId={cardId}
        listId={listId}
      />
      {canEdit && (
        <>
          <ChangePriorityContextMenuItems taskId={cardId} />
          <ChangeStatusContextMenuItems boardId={boardId} taskId={cardId} />
        </>
      )}
    </>
  );
}
