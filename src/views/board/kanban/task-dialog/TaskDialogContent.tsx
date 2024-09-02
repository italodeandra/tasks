import { useCallback, useEffect, useState } from "react";
import { MarkdownEditor } from "../../../../components/Kanban/MarkdownEditor";
import clsx from "@italodeandra/ui/utils/clsx";
import { imageUploadApi } from "../../../../pages/api/image-upload";
import { taskGetApi } from "../../../../pages/api/task/get";
import { StatusSelect } from "./StatusSelect";
import { ColumnSelect } from "./ColumnSelect";
import { taskUpdateApi } from "../../../../pages/api/task/update";
import Loading from "@italodeandra/ui/components/Loading";
import Skeleton from "@italodeandra/ui/components/Skeleton";
import { ProjectSelect } from "./ProjectSelect";
import { SubProjectSelect } from "./SubProjectSelect";
import { Assignees } from "./assignees/Assignees";
import { Activity } from "./Activity";
import { Timesheet } from "./Timesheet";

export function TaskDialogContent({
  boardId,
  taskId,
  canEdit,
}: {
  boardId: string;
  taskId: string;
  canEdit?: boolean;
}) {
  const [description, setDescription] = useState("");
  const [statusId, setStatusId] = useState("");
  const [columnId, setColumnId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [subProjectId, setSubProjectId] = useState("");

  const taskGet = taskGetApi.useQuery({
    _id: taskId,
  });
  useEffect(() => {
    if (taskGet.data) {
      setDescription(taskGet.data.description || "");
      setStatusId(taskGet.data.statusId || "");
      setColumnId(taskGet.data.columnId || "");
      setProjectId(taskGet.data.projectId || "");
      setSubProjectId(taskGet.data.subProjectId || "");
    }
  }, [taskGet.data]);

  const imageUpload = imageUploadApi.useMutation();
  const uploadClipboardImage = useCallback(
    async (image: string) => {
      const data = await imageUpload.mutateAsync({
        image,
      });
      return data.imageUrl;
    },
    [imageUpload],
  );

  const taskUpdate = taskUpdateApi.useMutation();
  const handleChangeDescription = useCallback(
    (value: string) => {
      setDescription(value);
      taskUpdate.mutate({
        _id: taskId,
        description: value,
      });
    },
    [taskId, taskUpdate],
  );

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="relative">
        {taskUpdate.isPending && <Loading className="absolute right-2 top-2" />}
        {taskGet.isLoading ? (
          <Skeleton className="mt-0.5 h-5 w-full max-w-60" />
        ) : (
          <MarkdownEditor
            placeholder={canEdit ? "Add a description" : "No description"}
            value={description}
            onChange={canEdit ? handleChangeDescription : undefined}
            className="-mx-1 mb-auto rounded-md px-1"
            editOnDoubleClick={canEdit}
            editHighlight
            uploadClipboardImage={uploadClipboardImage}
          />
        )}
      </div>
      <div className="flex flex-col gap-4">
        <div
          className={clsx(
            "flex flex-col gap-px",
            "[&>div:first-of-type>div:first-of-type]:rounded-tl [&>div:first-of-type>div:last-of-type]:rounded-tr",
            "[&>div:last-of-type>div:first-of-type]:rounded-bl [&>div:last-of-type>div:last-of-type]:rounded-br",
          )}
        >
          <div className="flex">
            <div className="w-28 bg-white/[0.05] px-2.5 py-2">Status</div>
            <div className="flex flex-1 items-center bg-white/[0.03] px-2.5 py-2">
              <StatusSelect
                taskId={taskId}
                boardId={boardId}
                value={statusId}
                onChange={setStatusId}
                loading={taskGet.isLoading}
                canEdit={canEdit}
              />
            </div>
          </div>
          <div className="flex">
            <div className="w-28 bg-white/[0.05] px-2.5 py-2">Column</div>
            <div className="flex flex-1 items-center bg-white/[0.03] px-2.5 py-2">
              <ColumnSelect
                taskId={taskId}
                boardId={boardId}
                value={columnId}
                onChange={setColumnId}
                loading={taskGet.isLoading}
                canEdit={canEdit}
              />
            </div>
          </div>
          <div className="flex">
            <div className="w-28 bg-white/[0.05] px-2.5 py-2">Project</div>
            <div className="flex flex-1 items-center bg-white/[0.03] px-2.5 py-2">
              <ProjectSelect
                taskId={taskId}
                boardId={boardId}
                value={projectId}
                onChange={setProjectId}
                loading={taskGet.isLoading}
                canEdit={canEdit}
              />
            </div>
          </div>
          {projectId && (
            <div className="flex">
              <div className="w-28 bg-white/[0.05] px-2.5 py-2">
                Sub project
              </div>
              <div className="flex flex-1 items-center bg-white/[0.03] px-2.5 py-2">
                <SubProjectSelect
                  projectId={projectId}
                  taskId={taskId}
                  boardId={boardId}
                  value={subProjectId}
                  onChange={setSubProjectId}
                  loading={taskGet.isLoading}
                  canEdit={canEdit}
                />
              </div>
            </div>
          )}
          <div className="flex">
            <div className="flex w-28 items-center bg-white/[0.05] px-2.5 py-2">
              Assigned to
            </div>
            <div className="flex flex-1 items-center bg-white/[0.03] px-2.5 py-1.5">
              {taskGet.isLoading && <Skeleton className="h-5 w-16" />}
              {taskGet.data?.assignees && (
                <Assignees
                  taskId={taskId}
                  assignees={taskGet.data?.assignees}
                  canEdit={canEdit}
                />
              )}
            </div>
          </div>
        </div>
        <Timesheet taskId={taskId} />
        <Activity taskId={taskId} />
      </div>
    </div>
  );
}
