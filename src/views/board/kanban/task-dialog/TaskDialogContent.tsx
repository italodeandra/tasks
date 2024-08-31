import { useCallback, useEffect, useState } from "react";
import { MarkdownEditor } from "../../../../components/Kanban/MarkdownEditor";
import clsx from "@italodeandra/ui/utils/clsx";
import Button from "@italodeandra/ui/components/Button";
import {
  ClockIcon,
  InformationCircleIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/20/solid";
import Textarea from "@italodeandra/ui/components/Textarea";
import fakeArray from "@italodeandra/ui/utils/fakeArray";
import { PlusIcon } from "@heroicons/react/16/solid";
import { imageUploadApi } from "../../../../pages/api/image-upload";
import { taskGetApi } from "../../../../pages/api/task/get";
import { StatusSelect } from "./StatusSelect";
import { ColumnSelect } from "./ColumnSelect";
import { taskUpdateApi } from "../../../../pages/api/task/update";
import Loading from "@italodeandra/ui/components/Loading";
import Skeleton from "@italodeandra/ui/components/Skeleton";
import { ProjectSelect } from "./ProjectSelect";
import { SubProjectSelect } from "./SubProjectSelect";

export function TaskDialogContent({
  boardId,
  taskId,
}: {
  boardId: string;
  taskId: string;
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
            placeholder="Add a description"
            value={description}
            onChange={handleChangeDescription}
            className="-mx-1 mb-auto rounded-md px-1"
            editOnDoubleClick
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
                />
              </div>
            </div>
          )}
          <div className="flex">
            <div className="flex w-28 items-center bg-white/[0.05] px-2.5 py-2">
              Assigned to
            </div>
            <div className="flex flex-1 flex-wrap gap-2 bg-white/[0.03] px-2.5 py-1.5">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-center text-xs">
                  IA
                </div>
                <span>Ítalo Andrade</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-center text-xs">
                  CA
                </div>
                <span>Cairo Andrade</span>
              </div>
              <Button
                icon
                variant="filled"
                color="gray"
                rounded
                size="xs"
                className="h-6 w-6 bg-zinc-700 p-0"
              >
                <PlusIcon />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">Timesheet</div>
          <div className="flex flex-wrap gap-2">
            <Button icon rounded size="sm">
              <ClockIcon />
            </Button>
            <div className="flex h-[34px] items-center rounded-full bg-white/[0.05]">
              <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-blue-600">
                IA
              </div>
              <div className="pl-2 pr-3">2h</div>
            </div>
            <div className="flex h-[34px] items-center rounded-full bg-white/[0.05]">
              <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-green-600">
                CA
              </div>
              <div className="pl-2 pr-3">3h</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">History</div>
          <div className="flex flex-col gap-4">
            <Textarea
              placeholder="Add new comment"
              trailing={
                <Button
                  icon
                  className="pointer-events-auto"
                  size="sm"
                  variant="text"
                >
                  <PaperAirplaneIcon />
                </Button>
              }
              inputClassName="dark:border-transparent"
              trailingClassName="pr-0.5 items-end pb-0.5"
            />
            <div className="flex gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-center text-xs">
                IA
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex h-6 items-center">
                  <div className="flex items-end gap-2">
                    <div className="text-zinc-300">
                      <span className="font-medium text-white">
                        Ítalo Andrade
                      </span>{" "}
                      moved task to{" "}
                      <span className="font-medium text-white">Doing</span>
                    </div>
                    <div className="mb-px text-xs text-zinc-500">
                      10 seconds ago
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {fakeArray(10).map((n) => (
              <div className="flex gap-2" key={n}>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-center text-xs">
                  IA
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex h-6 items-center">
                    <div className="flex items-end gap-2">
                      <div className="font-medium leading-none">
                        Ítalo Andrade
                      </div>
                      <div className="text-xs leading-none text-zinc-500">
                        10 seconds ago
                      </div>
                    </div>
                  </div>
                  <div className="text-zinc-300">This is a comment</div>
                </div>
              </div>
            ))}
            <div className="flex gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 text-xs text-zinc-500">
                <InformationCircleIcon className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex h-6 items-center">
                  <div className="flex items-end gap-2">
                    <div className="text-zinc-300">Task created</div>
                    <div className="mb-px text-xs text-zinc-500">
                      10 seconds ago
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
