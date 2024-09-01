import { TaskGetApi } from "../../../../../pages/api/task/get";
import { taskUpdateApi } from "../../../../../pages/api/task/update";
import { useCallback } from "react";
import { xor } from "lodash-es";
import { UserAvatarAndName } from "../../../../../components/UserAvatarAndName";
import Button from "@italodeandra/ui/components/Button";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { AddAssigneeButton } from "./AddAssigneeButton";
import clsx from "@italodeandra/ui/utils/clsx";

export function Assignees({
  taskId,
  assignees,
  canEdit,
}: {
  taskId: string;
  assignees: TaskGetApi["Response"]["assignees"];
  canEdit?: boolean;
}) {
  const taskUpdate = taskUpdateApi.useMutation();

  const handleRemoveAssigneeClick = useCallback(
    (assignee: TaskGetApi["Response"]["assignees"][0]) => () => {
      const currentAssignees = assignees.map((a) => a._id);
      taskUpdate.mutate({
        _id: taskId,
        assignees: xor(currentAssignees, [assignee._id]),
      });
    },
    [assignees, taskId, taskUpdate],
  );

  return (
    <div className="flex flex-wrap gap-2">
      {assignees.map((assignee) => (
        <div
          key={assignee._id}
          tabIndex={0}
          className={clsx(
            "group flex items-center gap-1.5 rounded-l-xl rounded-r-lg transition-colors",
            {
              "focus:bg-white/[0.03]": canEdit,
            },
          )}
        >
          <UserAvatarAndName {...assignee} />
          {canEdit && (
            <div className="group-focus:border-1 flex h-full w-0 scale-0 items-center justify-center overflow-hidden border-0 opacity-0 transition-all group-focus:w-[26px] group-focus:scale-100 group-focus:opacity-100">
              <Button
                as="div"
                variant="text"
                rounded
                icon
                className="mr-1 p-0.5"
                onClick={handleRemoveAssigneeClick(assignee)}
                loading={
                  taskUpdate.isPending && taskUpdate.variables._id === taskId
                }
                size="sm"
              >
                <XMarkIcon />
              </Button>
            </div>
          )}
        </div>
      ))}
      {canEdit && <AddAssigneeButton taskId={taskId} assignees={assignees} />}
    </div>
  );
}
