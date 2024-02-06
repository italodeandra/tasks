import Button from "@italodeandra/ui/components/Button";
import Group from "@italodeandra/ui/components/Group";
import Stack from "@italodeandra/ui/components/Stack";
import Text from "@italodeandra/ui/components/Text";
import { PlusIcon, TrashIcon } from "@heroicons/react/16/solid";
import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import Tooltip from "@italodeandra/ui/components/Tooltip";
import dayjs from "dayjs";
import { useState } from "react";
import Input from "@italodeandra/ui/components/Input";
import { commentListApi } from "../../../../../pages/api/comment/list";
import { commentAddApi } from "../../../../../pages/api/comment/add";
import fakeArray from "@italodeandra/ui/utils/fakeArray";
import Skeleton from "@italodeandra/ui/components/Skeleton";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { commentRemoveApi } from "../../../../../pages/api/comment/remove";
import clsx from "@italodeandra/ui/utils/clsx";

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
      content,
    });
    onSubmit();
  };

  return (
    <Input
      placeholder="New comment"
      autoFocus
      trailingClassName="pr-0.5"
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
      value={content}
      onChange={(e) => setContent(e.currentTarget.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSubmit();
        }
      }}
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

  return (
    <div className="group">
      {content}
      <div className="text-zinc-500 float-right flex gap-1">
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
        {dayjs(createdAt).fromNow()}
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
