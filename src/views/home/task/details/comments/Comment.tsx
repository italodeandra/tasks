import { commentRemoveApi } from "../../../../../pages/api/comment/remove";
import { useMemo } from "react";
import { markdownConverter } from "../../../../../utils/markdownConverter";
import clsx from "@italodeandra/ui/utils/clsx";
import dayjs from "dayjs";
import Tooltip from "@italodeandra/ui/components/Tooltip";
import Button from "@italodeandra/ui/components/Button";
import { TrashIcon } from "@heroicons/react/16/solid";

export function Comment({
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
