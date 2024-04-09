import Button from "@italodeandra/ui/components/Button";
import Group from "@italodeandra/ui/components/Group";
import Stack from "@italodeandra/ui/components/Stack";
import Text from "@italodeandra/ui/components/Text";
import { PlusIcon } from "@heroicons/react/16/solid";
import Tooltip from "@italodeandra/ui/components/Tooltip";
import { useState } from "react";
import { commentListApi } from "../../../../../pages/api/comment/list";
import fakeArray from "@italodeandra/ui/utils/fakeArray";
import Skeleton from "@italodeandra/ui/components/Skeleton";
import { Comment } from "./Comment";
import { NewComment } from "./NewComment";

export function Comments({ taskId }: { taskId: string }) {
  const [commenting, setCommenting] = useState(false);

  const { data, isLoading } = commentListApi.useQuery({
    taskId,
  });

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
