import { taskListApi } from "../../pages/api/task/list";
import { useCallback, useMemo } from "react";
import { Kanban } from "./kanban/Kanban";
import { useSnapshot } from "valtio";
import { homeState } from "./home.state";
import { KanbanSkeleton } from "./kanban/KanbanSkeleton";
import { useTaskBatchUpdateOrder } from "../../pages/api/task/batchUpdateOrder";
import Loading from "@italodeandra/ui/components/Loading";
import { TaskStatus } from "../../collections/task";
import { renderColumn } from "./column/Column";
import { NewProjectModal } from "./new-project/NewProjectModal";
import { ITask } from "./task/ITask";
import { renderTask } from "./task/renderTask";
import { Timesheet } from "./timesheet/Timesheet";

export function HomeView() {
  let { orientation, showTimesheet, editingTasks } = useSnapshot(homeState);
  let { data: databaseTasks, isLoading, isFetching } = taskListApi.useQuery();
  let { mutate: batchUpdate, isLoading: isUpdating } =
    useTaskBatchUpdateOrder();

  let kanbanTasks = useMemo<ITask[] | undefined>(
    () =>
      databaseTasks?.map(({ status, order, title, ...task }) => ({
        ...task,
        columnId: status,
        index: order,
        content: title,
      })),
    [databaseTasks]
  );

  let handleKanbanChange = useCallback(
    (tasks: ITask[]) => {
      if (tasks.length) {
        batchUpdate(
          tasks.map((task) => ({
            _id: task._id,
            status: task.columnId as TaskStatus,
            order: task.index,
          }))
        );
      }
    },
    [batchUpdate]
  );

  return (
    <>
      <NewProjectModal />
      {showTimesheet ? (
        <Timesheet />
      ) : (
        <div className="relative">
          {(isFetching || isUpdating) && (
            <Loading className="absolute right-10 top-[15px]" />
          )}
          {isLoading && <KanbanSkeleton />}
          {kanbanTasks && (
            <Kanban
              orientation={orientation}
              value={kanbanTasks}
              onChangeValue={handleKanbanChange}
              renderColumn={renderColumn}
              renderItem={renderTask}
              disabledItems={editingTasks as string[]}
            />
          )}
        </div>
      )}
    </>
  );
}
