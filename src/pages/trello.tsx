import { Trello } from "../views/trello/Trello";
import { useCallback } from "react";
import { showDialog } from "@italodeandra/ui/components/Dialog";
import { MarkdownEditor } from "../views/trello/MarkdownEditor";

export default function Page() {
  const handleTaskClick = useCallback(() => {
    showDialog({
      title: (
        <MarkdownEditor
          value="Task title"
          onChange={console.log}
          className="-mx-1 -mt-0.5 rounded-md px-1"
          editOnDoubleClick
          editHighlight
        />
      ),
      content: (
        <MarkdownEditor
          value="Task content"
          onChange={console.log}
          className="-mx-1 rounded-md px-1"
          editOnDoubleClick
          editHighlight
        />
      ),
    });
  }, []);

  return (
    <Trello
      data={{
        lists: [
          {
            _id: "665e78c7b3d3cf0f86db4c8d",
            title: "Todo",
            cards: [
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
            cards: [
              {
                _id: "665fdb6c403542034d819d2f",
                title: `Coding

When there's \`code\` in the middle of text

\`\`\`js
const thisIsCode = 2;
\`\`\``,
              },
            ],
          },
        ],
      }}
      onClickCard={handleTaskClick}
      cardName="task"
    />
  );
}
