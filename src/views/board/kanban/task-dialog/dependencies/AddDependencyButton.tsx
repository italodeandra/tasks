import Popover from "@italodeandra/ui/components/Popover";
import Button from "@italodeandra/ui/components/Button";
import { CheckIcon, PlusIcon } from "@heroicons/react/16/solid";
import Input from "@italodeandra/ui/components/Input";
import { TaskGetApi } from "../../../../../pages/api/task/get";
import { taskUpdateApi } from "../../../../../pages/api/task/update";
import { useCallback, useState } from "react";
import { xor } from "lodash-es";
import {
  TaskSearchApi,
  taskSearchApi,
} from "../../../../../pages/api/task/search";
import useDebounce from "@italodeandra/ui/hooks/useDebouncedValue";
import Skeleton from "@italodeandra/ui/components/Skeleton";

export function AddDependencyButton({
  taskId,
  dependencies,
}: {
  taskId: string;
  dependencies: TaskGetApi["Response"]["dependencies"];
}) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const taskSearch = taskSearchApi.useQuery({
    query: debouncedSearch,
    exclude: [taskId],
  });

  const taskUpdate = taskUpdateApi.useMutation();

  const handleClick = useCallback(
    (dependency: TaskSearchApi["Response"][0]) => () => {
      const currentDependencies = dependencies?.map((a) => a._id);
      taskUpdate.mutate({
        _id: taskId,
        dependencies: xor(currentDependencies, [dependency._id]),
      });
    },
    [dependencies, taskId, taskUpdate],
  );

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button
          icon
          variant="filled"
          color="gray"
          rounded
          size="xs"
          className="h-6 w-6 bg-zinc-700 p-0"
          loading={taskUpdate.isPending}
        >
          <PlusIcon />
        </Button>
      </Popover.Trigger>
      <Popover.Content>
        <div className="flex flex-col gap-1">
          <Input
            placeholder="Search a task"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {taskSearch.isLoading && <Skeleton className="h-10" />}
          {debouncedSearch && taskSearch.data?.length === 0 && (
            <div className="p-2 text-sm text-gray-500">No tasks found</div>
          )}
          {taskSearch.data?.map((dependency) => (
            <Button
              key={dependency._id}
              variant="text"
              size="sm"
              className="relative justify-start gap-1.5 pl-8 text-left"
              onClick={handleClick(dependency)}
            >
              {dependencies?.some((a) => a._id === dependency._id) && (
                <CheckIcon className="absolute left-2 top-2 h-4 w-4" />
              )}
              {dependency.title}
            </Button>
          ))}
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
