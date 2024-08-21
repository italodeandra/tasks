import { Trello } from "../../components/Trello/Trello";
import { useCallback, useMemo } from "react";
import { showDialog } from "@italodeandra/ui/components/Dialog";
import { pick } from "lodash-es";
import { IList } from "../../components/Trello/IList";
import { useSnapshot } from "valtio";
import { state } from "./state";
import { TaskDialogTitle } from "./TaskDialogTitle";
import { TaskDialogContent } from "./TaskDialogContent";

export function TrelloView() {
  const { data } = useSnapshot(state);

  const handleTaskClick = useCallback(
    (selected: { cardId: string; listId: string }) => {
      showDialog({
        titleClassName: "mb-0",
        contentOverflowClassName: "max-w-screen-xl gap-4",
        title: <TaskDialogTitle selected={selected} />,
        content: <TaskDialogContent selected={selected} />,
      });
    },
    [],
  );

  const handleDataChange = useCallback((newData: IList[]) => {
    state.data = newData.map((list) => ({
      _id: list._id,
      title: list.title,
      tasks: list.cards?.map((card) => ({
        _id: card._id,
        title: card.title,
      })),
    }));
  }, []);

  return (
    <Trello
      data={useMemo(
        () =>
          data.map((list) => ({
            ...pick(list, ["_id", "title"]),
            cards: list.tasks?.map((task) => pick(task, ["_id", "title"])),
          })),
        [data],
      )}
      onChange={handleDataChange}
      onClickCard={handleTaskClick}
      cardName="task"
      listName="status"
    />
  );
}
