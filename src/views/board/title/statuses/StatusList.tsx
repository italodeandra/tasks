import { IStatus } from "./IStatus";
import { useCallback } from "react";
import Skeleton from "@italodeandra/ui/components/Skeleton";
import Button from "@italodeandra/ui/components/Button";
import { PlusIcon } from "@heroicons/react/20/solid";
import { taskStatusListApi } from "../../../../pages/api/task-status/list";

export function StatusList({
  onEdit,
  boardId,
}: {
  onEdit: (team: IStatus) => void;
  boardId: string;
}) {
  const taskStatusList = taskStatusListApi.useQuery({ boardId });

  const handleNewStatusClick = useCallback(() => {
    onEdit({
      _id: "new",
      title: "",
    });
  }, [onEdit]);

  const handleTeamClick = useCallback(
    (status: IStatus) => () => {
      onEdit(status);
    },
    [onEdit],
  );

  return (
    <div className="mt-1 flex flex-col gap-2">
      {taskStatusList.isLoading && <Skeleton className="h-[38px]" />}
      {taskStatusList.data?.map((team) => (
        <Button
          variant="filled"
          key={team._id}
          className="min-h-[38px] justify-start rounded-lg py-px pl-3 pr-px text-left font-normal text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:active:border-zinc-500"
          onClick={handleTeamClick(team)}
        >
          {team.title}
        </Button>
      ))}
      <Button
        variant="text"
        className="justify-start rounded-lg px-3 py-2 text-left font-normal text-zinc-300"
        leading={<PlusIcon />}
        onClick={handleNewStatusClick}
      >
        New status
      </Button>
    </div>
  );
}
