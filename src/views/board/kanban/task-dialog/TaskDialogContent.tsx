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
import { Activity } from "./activity/Activity";
import { Timesheet } from "./timesheet/Timesheet";
import { SecondaryProjectsSelect } from "./SecondaryProjectsSelect";
import { isTouchDevice } from "@italodeandra/ui/utils/isBrowser";
import { closeDialog } from "@italodeandra/ui/components/Dialog";
import { PriorityInput } from "./PriorityInput";

export function TaskDialogContent({
  dialogId,
  boardId,
  taskId,
}: {
  dialogId: string;
  boardId: string;
  taskId: string;
}) {
  const [description, setDescription] = useState("");
  const [statusId, setStatusId] = useState("");
  const [columnId, setColumnId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [subProjectId, setSubProjectId] = useState("");
  const [secondaryProjectsIds, setSecondaryProjectsIds] = useState<string[]>(
    [],
  );
  const [priority, setPriority] = useState<number>();

  const taskGet = taskGetApi.useQuery(
    {
      _id: taskId,
    },
    {
      enabled: !!taskId,
    },
  );
  const task = taskGet.data;
  useEffect(() => {
    if (task) {
      setDescription(task.description || "");
      setStatusId(task.statusId || "");
      setColumnId(task.columnId || "");
      setProjectId(task.projectId || "");
      setSubProjectId(task.subProjectId || "");
      setSecondaryProjectsIds(task.secondaryProjectsIds || []);
      setPriority(task.priority);
    }
  }, [task]);
  useEffect(() => {
    if (taskGet.isError) {
      closeDialog(dialogId);
    }
  }, [dialogId, taskGet.isError]);

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

  useEffect(() => {
    if (task && task.priority !== priority) {
      taskUpdate.mutate({
        _id: taskId,
        priority,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priority]);

  const labelWidthClassName = "w-40";

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <div className="relative">
        {taskUpdate.isPending && <Loading className="absolute right-2 top-2" />}
        {taskGet.isLoading ? (
          <Skeleton className="mt-0.5 h-5 w-full max-w-60" />
        ) : (
          <MarkdownEditor
            placeholder={task?.canEdit ? "Add a description" : "No description"}
            value={description}
            onChange={task?.canEdit ? handleChangeDescription : undefined}
            className="-mx-1 mb-auto rounded-md px-1"
            editOnDoubleClick={task?.canEdit}
            editHighlight
            uploadClipboardImage={uploadClipboardImage}
            editOnClick={isTouchDevice}
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
            <div
              className={clsx(
                "bg-white/[0.05] px-2.5 py-2",
                labelWidthClassName,
              )}
            >
              Column
            </div>
            <div className="flex flex-1 items-center bg-white/[0.03] px-2.5 py-2">
              <ColumnSelect
                taskId={taskId}
                boardId={boardId}
                value={columnId}
                onChange={setColumnId}
                loading={taskGet.isLoading}
                canEdit={task?.canEdit}
              />
            </div>
          </div>
          <div className="flex">
            <div
              className={clsx(
                "bg-white/[0.05] px-2.5 py-2",
                labelWidthClassName,
              )}
            >
              Status
            </div>
            <div className="flex flex-1 items-center bg-white/[0.03] px-2.5 py-2">
              <StatusSelect
                taskId={taskId}
                boardId={boardId}
                value={statusId}
                onChange={setStatusId}
                loading={taskGet.isLoading}
                canEdit={task?.canEdit}
              />
            </div>
          </div>
          <div className="flex">
            <div
              className={clsx(
                "bg-white/[0.05] px-2.5 py-2",
                labelWidthClassName,
              )}
            >
              Priority
            </div>
            <div className="flex flex-1 items-center bg-white/[0.03]">
              <PriorityInput
                value={priority}
                onChange={setPriority}
                loading={taskGet.isLoading}
              />
            </div>
          </div>
          <div className="flex">
            <div
              className={clsx(
                "bg-white/[0.05] px-2.5 py-2",
                labelWidthClassName,
              )}
            >
              Project
            </div>
            <div className="flex flex-1 items-center bg-white/[0.03] px-2.5 py-2">
              <ProjectSelect
                taskId={taskId}
                boardId={boardId}
                value={projectId}
                onChange={setProjectId}
                loading={taskGet.isLoading}
                canEdit={task?.canEdit}
              />
            </div>
          </div>
          {projectId && (
            <>
              <div className="flex">
                <div
                  className={clsx(
                    "bg-white/[0.05] px-2.5 py-2",
                    labelWidthClassName,
                  )}
                >
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
                    canEdit={task?.canEdit}
                  />
                </div>
              </div>
              <div className="flex">
                <div
                  className={clsx(
                    "bg-white/[0.05] px-2.5 py-2",
                    labelWidthClassName,
                  )}
                >
                  Secondary projects
                </div>
                <div className="flex flex-1 items-center bg-white/[0.03] px-2.5 py-2">
                  <SecondaryProjectsSelect
                    projectId={projectId}
                    taskId={taskId}
                    boardId={boardId}
                    value={secondaryProjectsIds}
                    onChange={setSecondaryProjectsIds}
                    loading={taskGet.isLoading}
                    canEdit={task?.canEdit}
                  />
                </div>
              </div>
            </>
          )}
          <div className="flex">
            <div
              className={clsx(
                "bg-white/[0.05] px-2.5 py-2",
                labelWidthClassName,
              )}
            >
              Assigned to
            </div>
            <div className="flex flex-1 items-center bg-white/[0.03] px-2.5 py-1.5">
              {taskGet.isLoading && <Skeleton className="h-5 w-16" />}
              {task?.assignees && (
                <Assignees
                  taskId={taskId}
                  assignees={task?.assignees}
                  canEdit={task?.canEdit}
                />
              )}
            </div>
          </div>
        </div>
        {task?.canEdit && <Timesheet taskId={taskId} />}
        <Activity taskId={taskId} canComment={task?.canComment} />
      </div>
    </div>
  );
}
