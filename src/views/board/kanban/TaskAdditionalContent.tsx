import Tooltip from "@italodeandra/ui/components/Tooltip";
import Button from "@italodeandra/ui/components/Button/Button";
import stopPropagation from "@italodeandra/ui/utils/stopPropagation";
import { PlayIcon } from "@heroicons/react/16/solid";
import { taskListApi } from "../../../pages/api/task/list";
import { useSnapshot } from "valtio";
import { boardState } from "../board.state";
import { Fragment, useMemo } from "react";
import getInitials from "@italodeandra/ui/utils/getInitials";
import { getColorForString } from "../../../components/ColorPicker/colors";

export function TaskAdditionalContent({
  cardId,
  boardId,
}: {
  listId: string;
  cardId: string;
  boardId: string;
  dragging: boolean;
}) {
  const { selectedProjects, selectedSubProjects } = useSnapshot(boardState);
  const taskList = taskListApi.useQuery(
    {
      boardId,
      selectedProjects: selectedProjects as string[],
      selectedSubProjects: selectedSubProjects as string[],
    },
    {
      enabled: false,
    },
  );

  const task = useMemo(
    () =>
      taskList.data
        ?.find((list) => list.tasks?.some((task) => task._id === cardId))
        ?.tasks?.find((task) => task._id === cardId),
    [cardId, taskList.data],
  );

  if (!task?.assignees.length) {
    return null;
  }

  return (
    <div className="flex justify-end gap-2 px-3 pb-3">
      {task.assignees.map((assignee) => {
        const initials = getInitials(assignee.name || assignee.email);
        return (
          <Fragment key={assignee._id}>
            {assignee.isMe ? (
              <Tooltip content="Start tracking time on this task">
                <Button
                  variant="filled"
                  rounded
                  className="group/myself pointer-events-auto relative h-6 w-6 p-0 text-xs dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
                  onClick={stopPropagation}
                  onTouchStart={stopPropagation}
                  onMouseDown={stopPropagation}
                >
                  <span className="absolute inset-0 flex items-center justify-center opacity-100 transition-opacity group-hover/myself:opacity-0">
                    {initials}
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover/myself:opacity-100">
                    <PlayIcon className="-mr-0.5 h-4 w-4" />
                  </span>
                </Button>
              </Tooltip>
            ) : (
              <Tooltip content={assignee.name || assignee.email}>
                <div
                  className="pointer-events-auto flex h-6 w-6 items-center justify-center rounded-full p-0 text-xs text-white"
                  style={{
                    backgroundColor: getColorForString(assignee._id),
                  }}
                >
                  {initials}
                </div>
              </Tooltip>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
