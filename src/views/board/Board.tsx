import { TrelloKanban } from "../trello/kanban/TrelloKanban";

export function Board({ _id }: { _id: string }) {
  return <TrelloKanban boardId={_id} />;
}
