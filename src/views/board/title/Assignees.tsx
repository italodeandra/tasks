import clsx from "@italodeandra/ui/utils/clsx";
import { useSnapshot } from "valtio";
import Skeleton from "@italodeandra/ui/components/Skeleton";
import { boardListAssigneesApi } from "../../../pages/api/board/list-assignees";
import { boardState } from "../board.state";
import { UserAvatar } from "../../../components/UserAvatar";
import Button from "@italodeandra/ui/components/Button";
import { xor } from "lodash-es";
import { NoSymbolIcon } from "@heroicons/react/24/solid";
import Tooltip from "@italodeandra/ui/components/Tooltip";

export function Assignees({ boardId }: { boardId: string }) {
  const { selectedAssignees } = useSnapshot(boardState);

  const boardListAssignees = boardListAssigneesApi.useQuery({
    boardId,
  });

  if (boardListAssignees.isLoading) {
    return <Skeleton className="h-[32px] w-[87px] dark:bg-white/5" />;
  }

  return (
    <div
      className={clsx(
        "flex items-center justify-center gap-1 rounded-lg bg-white/[0.03] px-1 transition-colors",
        {
          "bg-white/10": !!selectedAssignees.length,
        },
      )}
    >
      {boardListAssignees.data?.map((assignee) => (
        <Tooltip key={assignee._id} content={assignee.name || assignee.email}>
          <Button
            rounded
            className="p-0"
            variant={
              selectedAssignees.includes(assignee._id) ? "filled" : "text"
            }
            color={
              selectedAssignees.includes(assignee._id) ? "success" : undefined
            }
            onClick={() => {
              boardState.selectedAssignees = xor(
                selectedAssignees.filter((assignee) => assignee !== "__NONE__"),
                [assignee._id],
              );
            }}
          >
            <UserAvatar {...assignee} />
          </Button>
        </Tooltip>
      ))}
      <Tooltip content="No assignees">
        <Button
          rounded
          className="p-0.5"
          variant="outlined"
          color={selectedAssignees.includes("__NONE__") ? "success" : undefined}
          onClick={() => {
            if (selectedAssignees.includes("__NONE__")) {
              boardState.selectedAssignees = [];
            } else {
              boardState.selectedAssignees = ["__NONE__"];
            }
          }}
          icon
        >
          <NoSymbolIcon className="text-zinc-500" />
        </Button>
      </Tooltip>
    </div>
  );
}
