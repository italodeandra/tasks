import Button from "@italodeandra/ui/components/Button";
import Group from "@italodeandra/ui/components/Group";
import Stack from "@italodeandra/ui/components/Stack";
import Text from "@italodeandra/ui/components/Text";
import { PlusIcon, TrashIcon } from "@heroicons/react/16/solid";
import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import Tooltip from "@italodeandra/ui/components/Tooltip";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import Input from "@italodeandra/ui/components/Input";
import { commentListApi } from "../../../../../pages/api/comment/list";
import { commentAddApi } from "../../../../../pages/api/comment/add";
import fakeArray from "@italodeandra/ui/utils/fakeArray";
import Skeleton from "@italodeandra/ui/components/Skeleton";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { commentRemoveApi } from "../../../../../pages/api/comment/remove";
import clsx from "@italodeandra/ui/utils/clsx";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { markdownConverter } from "../../../../../utils/markdownConverter";

function NewComment({
  taskId,
  onSubmit,
}: {
  taskId: string;
  onSubmit: () => void;
}) {
  const [content, setContent] = useState("");
  const { mutate, isLoading } = commentAddApi.useMutation();

  const handleSubmit = () => {
    mutate({
      _id: isomorphicObjectId().toString(),
      taskId,
      content: content.trim(),
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
          markdown({ base: markdownLanguage }),
        ],
        theme: vscodeDark,
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
          loading={isLoading}
          onClick={handleSubmit}
        >
          <PaperAirplaneIcon />
        </Button>
      }
    />
  );
}

function Comment({
  _id,
  content,
  createdAt,
}: {
  _id: string;
  content: string;
  createdAt: string;
}) {
  const { mutate: remove, isLoading: isRemoving } =
    commentRemoveApi.useMutation();

  const markdownHtml = useMemo(
    () => markdownConverter.makeHtml(content.trim()),
    [content]
  );

  return (
    <div className="group">
      <div
        className={clsx(
          "prose prose-zinc dark:prose-invert text-sm",
          "prose-pre:p-0 prose-ul:my-0 prose-li:my-0 prose-p:my-0 [&_.task-list-item]:pl-3 [&_p+p]:mt-4"
        )}
        dangerouslySetInnerHTML={{ __html: markdownHtml }}
      />
      <div className="text-zinc-500 flex gap-1 text-xs">
        <span>{dayjs(createdAt).fromNow()}</span>
        <Tooltip content="Delete this comment">
          <Button
            icon
            size="xs"
            variant="text"
            className={clsx(
              "-my-1 group-hover:opacity-100 opacity-0 transition",
              {
                "opacity-100": isRemoving,
              }
            )}
            loading={isRemoving}
            onClick={() => remove({ _id })}
          >
            <TrashIcon />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}

export function Comments({ taskId }: { taskId: string }) {
  const [commenting, setCommenting] = useState(false);

  let { data, isLoading } = commentListApi.useQuery({
    taskId,
  });

  // data = null;
  // isLoading = true;

  return (
    <Stack className="p-4">
      <Group>
        <Text variant="label">Comments</Text>
        <div className="grow" />
        <Tooltip content="Add new comment">
          <Button
            icon
            size="xs"
            variant="text"
            className="-my-1 -mr-1"
            onClick={() => setCommenting(!commenting)}
          >
            <PlusIcon />
          </Button>
        </Tooltip>
      </Group>
      {commenting && (
        <NewComment taskId={taskId} onSubmit={() => setCommenting(false)} />
      )}
      {isLoading &&
        fakeArray(3).map((_, i) => <Skeleton key={i} className="h-4" />)}
      {data?.map((comment) => (
        <Comment key={comment._id} {...comment} />
      ))}
    </Stack>
  );
}
