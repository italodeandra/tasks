import { taskListEligibleAssigneesApi } from "../../../../../pages/api/task/list-eligible-assignees";
import Popover from "@italodeandra/ui/components/Popover";
import Button from "@italodeandra/ui/components/Button";
import { CheckIcon, PlusIcon } from "@heroicons/react/16/solid";
import Input from "@italodeandra/ui/components/Input";
import { UserAvatarAndName } from "../../../../../components/UserAvatarAndName";
import { TaskGetApi } from "../../../../../pages/api/task/get";
import { taskUpdateApi } from "../../../../../pages/api/task/update";
import { useCallback, useState } from "react";
import { xor } from "lodash-es";

export function AddAssigneeButton({
  taskId,
  assignees,
}: {
  taskId: string;
  assignees: TaskGetApi["Response"]["assignees"];
}) {
  const [search, setSearch] = useState("");
  const taskListEligibleAssignees = taskListEligibleAssigneesApi.useQuery({
    taskId,
  });

  const taskUpdate = taskUpdateApi.useMutation();

  const handleAssigneeClick = useCallback(
    (assignee: TaskGetApi["Response"]["assignees"][0]) => () => {
      const currentAssignees = assignees.map((a) => a._id);
      taskUpdate.mutate({
        _id: taskId,
        assignees: xor(currentAssignees, [assignee._id]),
      });
    },
    [assignees, taskId, taskUpdate],
  );

  const filteredEligibleAssignees = taskListEligibleAssignees.data?.filter(
    (assignee) =>
      assignee.name?.toLowerCase().includes(search.toLowerCase()) ||
      assignee.email.toLowerCase().includes(search.toLowerCase()),
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
            placeholder="Search an user"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {filteredEligibleAssignees?.map((assignee) => (
            <Button
              key={assignee._id}
              variant="text"
              size="sm"
              className="relative justify-start gap-1.5 pl-8 text-left"
              onClick={handleAssigneeClick(assignee)}
            >
              {assignees.some((a) => a._id === assignee._id) && (
                <CheckIcon className="absolute left-2 top-2.5 h-4 w-4" />
              )}
              <UserAvatarAndName {...assignee} />
            </Button>
          ))}
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
