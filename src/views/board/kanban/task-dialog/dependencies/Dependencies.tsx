import { TaskGetApi } from "../../../../../pages/api/task/get";
import { taskUpdateApi } from "../../../../../pages/api/task/update";
import { useCallback, useState } from "react";
import { xor } from "lodash-es";
import Button from "@italodeandra/ui/components/Button";
import { XMarkIcon } from "@heroicons/react/20/solid";
import clsx from "@italodeandra/ui/utils/clsx";
import { AddDependencyButton } from "./AddDependencyButton";
import Routes from "../../../../../Routes";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/16/solid";

export function Dependencies({
  boardId,
  taskId,
  dependencies,
  canEdit,
}: {
  boardId: string;
  taskId: string;
  dependencies: TaskGetApi["Response"]["dependencies"];
  canEdit?: boolean;
}) {
  const [focused, setFocused] = useState<string>();
  const taskUpdate = taskUpdateApi.useMutation();

  const handleRemoveClick = useCallback(
    (dependency: NonNullable<TaskGetApi["Response"]["dependencies"]>[0]) =>
      () => {
        const currentDependencies = dependencies?.map((a) => a._id);
        taskUpdate.mutate({
          _id: taskId,
          dependencies: xor(currentDependencies, [dependency._id]),
        });
      },
    [dependencies, taskId, taskUpdate],
  );

  return (
    <div className="flex flex-wrap gap-2">
      <div className="-ml-1.5 flex flex-wrap gap-2">
        {dependencies?.map((dependency) => (
          <div
            key={dependency._id}
            tabIndex={0}
            className={clsx(
              "group flex items-center gap-1.5 rounded-lg pl-2 transition-colors",
              {
                "focus:bg-white/[0.03]": canEdit,
              },
            )}
            onFocus={() => setFocused(dependency._id)}
            onBlur={() => setFocused(undefined)}
          >
            {dependency.title}
            <div
              className={clsx(
                "flex h-full max-w-0 scale-0 items-center justify-center overflow-hidden border-0 opacity-0 transition-all",
                {
                  "border-1 max-w-[60px] scale-100 opacity-100":
                    focused === dependency._id,
                },
              )}
            >
              <Button
                variant="text"
                rounded
                icon
                className="mr-1 p-0.5"
                href={Routes.Task(boardId, dependency._id)}
                size="sm"
                onFocus={() => setFocused(dependency._id)}
              >
                <ArrowTopRightOnSquareIcon />
              </Button>
              {canEdit && (
                <Button
                  variant="text"
                  rounded
                  icon
                  className="mr-1 p-0.5"
                  onClick={handleRemoveClick(dependency)}
                  loading={
                    taskUpdate.isPending && taskUpdate.variables._id === taskId
                  }
                  size="sm"
                  onFocus={() => setFocused(dependency._id)}
                >
                  <XMarkIcon />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      {canEdit && (
        <AddDependencyButton taskId={taskId} dependencies={dependencies} />
      )}
    </div>
  );
}
