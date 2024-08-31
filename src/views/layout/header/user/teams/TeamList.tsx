import { ITeam } from "./ITeam";
import { teamListApi } from "../../../../../pages/api/team/list";
import { useCallback } from "react";
import Skeleton from "@italodeandra/ui/components/Skeleton";
import Button from "@italodeandra/ui/components/Button";
import { PencilIcon } from "@heroicons/react/24/solid";
import { PlusIcon } from "@heroicons/react/20/solid";

export function TeamList({
  onSelect,
  onEdit,
}: {
  onSelect: (team: ITeam) => void;
  onEdit: (team: ITeam) => void;
}) {
  const teamList = teamListApi.useQuery();

  const handleNewTeamClick = useCallback(() => {
    onEdit({
      _id: "new",
      name: "",
    });
  }, [onEdit]);

  const handleTeamClick = useCallback(
    (team: ITeam) => () => {
      onSelect(team);
    },
    [onSelect],
  );

  return (
    <div className="mt-1 flex flex-col gap-2">
      {teamList.isLoading && <Skeleton className="h-[38px]" />}
      {teamList.data?.map((team) => (
        <Button
          variant="filled"
          key={team._id}
          className="min-h-[38px] justify-start rounded-lg py-px pl-3 pr-px text-left font-normal text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:active:border-zinc-500"
          onClick={handleTeamClick(team)}
        >
          <div className="flex-1">{team.name}</div>
          {team.canEdit && (
            <Button
              as="div"
              icon
              variant="text"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(team);
              }}
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          )}
        </Button>
      ))}
      <Button
        variant="text"
        className="justify-start rounded-lg px-3 py-2 text-left font-normal text-zinc-300"
        leading={<PlusIcon />}
        onClick={handleNewTeamClick}
      >
        New team
      </Button>
    </div>
  );
}
