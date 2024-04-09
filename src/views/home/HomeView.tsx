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
import { ITask } from "./task/ITask";
import { renderTask } from "./task/renderTask";
import { Timesheet } from "./timesheet/Timesheet";

export function HomeView() {
  const { orientation, showTimesheet, editingTasks, hiddenColumns } =
    useSnapshot(homeState);
  const { data: databaseTasks, isLoading, isFetching } = taskListApi.useQuery();
  const { mutate: batchUpdate, isLoading: isUpdating } =
    useTaskBatchUpdateOrder();

  const kanbanTasks = useMemo<ITask[] | undefined>(
    () =>
      databaseTasks?.map(({ status, order, title, ...task }) => ({
        ...task,
        columnId: status,
        index: order,
        content: title,
      })),
    [databaseTasks]
  );

  const handleKanbanChange = useCallback(
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
              hiddenColumns={hiddenColumns as string[]}
            />
          )}
        </div>
      )}
    </>
  );
}
