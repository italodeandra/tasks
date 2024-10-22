import { useSnapshot } from "valtio";
import { boardState } from "../../board.state";
import { useAuthGetUser } from "@italodeandra/auth/api/getUser";
import { taskListApi } from "../../../../pages/api/task/list";
import { useCallback, useMemo } from "react";
import { taskUpdateApi } from "../../../../pages/api/task/update";
import { xor } from "lodash-es";
import ContextMenu from "@italodeandra/ui/components/ContextMenu";

export function AssignToMeContextMenuItem({
  boardId,
  cardId,
  listId,
}: {
  boardId: string;
  cardId: string;
  listId: string;
}) {
  const authGetUser = useAuthGetUser();

  const { selectedProjects, selectedSubProjects, selectedAssignees } =
    useSnapshot(boardState);
  const taskList = taskListApi.useQuery({
    boardId,
    selectedProjects: selectedProjects as string[],
    selectedSubProjects: selectedSubProjects as string[],
    selectedAssignees: selectedAssignees as string[],
  });

  const task = useMemo(
    () =>
      taskList.data
        ?.find((task) => task._id === listId)
        ?.tasks?.find((task) => task._id === cardId),
    [cardId, listId, taskList.data],
  );

  const taskUpdate = taskUpdateApi.useMutation();

  const handleAssignToMeClick = useCallback(() => {
    if (task && authGetUser.data) {
      const currentAssignees = task.assignees.map((a) => a._id);
      taskUpdate.mutate({
        _id: task._id,
        assignees: xor(currentAssignees, [authGetUser.data._id]),
      });
    }
  }, [authGetUser.data, task, taskUpdate]);

  const isNotAssignedToMe = useMemo(
    () =>
      task?.assignees.every(
        (assignee) => assignee._id !== authGetUser.data?._id,
      ),
    [authGetUser.data, task],
  );

  return (
    <>
      {isNotAssignedToMe && task && authGetUser.data && (
        <ContextMenu.Item onClick={handleAssignToMeClick}>
          Assign to me
        </ContextMenu.Item>
      )}
    </>
  );
}
