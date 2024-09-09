import { taskActivityCommentEditApi } from "../../../../../pages/api/task-activity/comment/edit";
import { useCallback, useEffect, useState } from "react";
import { MarkdownEditor } from "../../../../../components/Kanban/MarkdownEditor";
import Loading from "@italodeandra/ui/components/Loading";

export function Comment({
  activityId,
  content: defaultContent,
  canEdit,
}: {
  activityId: string;
  content: string;
  canEdit: boolean;
}) {
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    setContent(defaultContent);
  }, [defaultContent]);

  const taskActivityCommentEdit = taskActivityCommentEditApi.useMutation();

  const handleOnChange = useCallback(
    (newContent: string) => {
      setContent(newContent);
      taskActivityCommentEdit.mutate({
        _id: activityId,
        newContent,
      });
    },
    [taskActivityCommentEdit, activityId],
  );

  return (
    <div className="flex gap-2 border-b border-b-white/5 pb-1.5">
      <MarkdownEditor
        className="-m-1 flex-1 cursor-text rounded p-1 text-sm text-zinc-300"
        value={content}
        editOnDoubleClick
        editHighlight
        onChange={canEdit ? handleOnChange : undefined}
      />
      {taskActivityCommentEdit.isPending && <Loading className="mt-1" />}
    </div>
  );
}
