import { Trello } from "../views/trello/Trello";
import { useCallback, useMemo, useState } from "react";
import { showDialog } from "@italodeandra/ui/components/Dialog";
import { MarkdownEditor } from "../views/trello/MarkdownEditor";
import { find, pick } from "lodash-es";
import { IList } from "../views/trello/IList";
import { produce } from "immer";

export default function Page() {
  const [data, setData] = useState<
    {
      _id: string;
      title: string;
      tasks?: {
        _id: string;
        title: string;
        description?: string;
      }[];
    }[]
  >([
    {
      _id: "665e78c7b3d3cf0f86db4c8d",
      title: "Todo",
      tasks: [
        {
          _id: "665e78f7c9e5ab7e262c1e9a",
          title: "Buy milk",
        },
        {
          _id: "665e78f9f32b8de9e1532975",
          title: "Buy bread",
        },
        {
          _id: "665f2378c6316ed4eefbaed8",
          title: "Buy eggs",
        },
      ],
    },
    {
      _id: "665f23b72ca02db00eafcb23",
      title: "Doing",
      tasks: [
        {
          _id: "665fdb6c403542034d819d2f",
          title: `Coding

When there's \`code\` in the middle of text

\`\`\`js
const thisIsCode = 2;
\`\`\``,
          description: "This is a description",
        },
      ],
    },
  ]);

  const handleTaskClick = useCallback(
    (selected: { cardId: string; listId: string }) => {
      const list = find(data, { _id: selected.listId });
      if (!list) return;
      const task = find(list.tasks, { _id: selected.cardId });
      if (!task) return;

      const handleTitleChange = (title: string) => {
        const newData = produce(data, (draft) => {
          const list = find(draft, { _id: selected.listId });
          if (!list) return;
          const task = find(list.tasks, { _id: selected.cardId });
          if (!task) return;
          task.title = title;
        });
        setData(newData);
      };

      const handleDescriptionChange = (description: string) => {
        const newData = produce(data, (draft) => {
          const list = find(draft, { _id: selected.listId });
          if (!list) return;
          const task = find(list.tasks, { _id: selected.cardId });
          if (!task) return;
          task.description = description;
        });
        setData(newData);
      };

      showDialog({
        title: (
          <MarkdownEditor
            value={task.title}
            onChange={handleTitleChange}
            className="-mx-1 -mt-0.5 rounded-md px-1"
            editOnDoubleClick
            editHighlight
          />
        ),
        content: (
          <MarkdownEditor
            value={task.description || ""}
            onChange={handleDescriptionChange}
            className="-mx-1 rounded-md px-1"
            editOnDoubleClick
            editHighlight
          />
        ),
      });
    },
    [data],
  );

  const handleDataChange = useCallback((newData: IList[]) => {
    setData(
      newData.map((list) => ({
        _id: list._id,
        title: list.title,
        tasks: list.cards?.map((card) => ({
          _id: card._id,
          title: card.title,
        })),
      })),
    );
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
