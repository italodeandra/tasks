import { useState } from "react";
import { commentAddApi } from "../../../../../pages/api/comment/add";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import Input from "@italodeandra/ui/components/Input";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import Button from "@italodeandra/ui/components/Button";
import { PaperAirplaneIcon } from "@heroicons/react/20/solid";

export function NewComment({
                             taskId,
                             onSubmit
                           }: {
  taskId: string;
  onSubmit: () => void;
}) {
  const [content, setContent] = useState("");
  const { mutate, isPending } = commentAddApi.useMutation();

  const handleSubmit = () => {
    mutate({
      _id: isomorphicObjectId().toString(),
      taskId,
      content: content.trim()
    });
    onSubmit();
  };

  return (
    <Input
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      as={CodeMirror as any}
      {...({
        onChange: setContent,
        extensions: [
          EditorView.lineWrapping,
          markdown({ base: markdownLanguage })
        ],
        theme: vscodeDark
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      } as any)}
      value={content}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSubmit();
        }
      }}
      placeholder="New comment"
      autoFocus
      trailingClassName="pr-0.5"
      inputClassName="dark:bg-[#1e1e1e] pl-0"
      trailing={
        <Button
          icon
          variant="text"
          className="pointer-events-auto"
          size="sm"
          loading={isPending}
          onClick={handleSubmit}
        >
          <PaperAirplaneIcon />
        </Button>
      }
    />
  );
}
