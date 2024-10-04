import { AssignToMeContextMenuItem } from "./AssignToMeContextMenuItem";
import { ChangePriorityContextMenuItems } from "./ChangePriorityContextMenuItems";

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
    </>
  );
}
