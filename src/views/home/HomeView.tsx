import { taskListApi } from "../../pages/api/task/list";
import { useCallback, useMemo } from "react";
import { Kanban } from "./kanban/Kanban";
import Group from "@italodeandra/ui/components/Group";
import { useSnapshot } from "valtio";
import { homeState } from "./home.state";
import { OrientationSelect } from "./OrientationSelect";
import { KanbanSkeleton } from "./kanban/KanbanSkeleton";
import clsx from "@italodeandra/ui/utils/clsx";
import { useTaskBatchUpdateOrder } from "../../pages/api/task/batchUpdateOrder";
import Loading from "@italodeandra/ui/components/Loading";
import { TaskStatus } from "../../collections/task";
import { renderColumn } from "./column/Column";
import { NewProjectModal } from "./new-project/NewProjectModal";
import { ITask } from "./task/ITask";
import { renderTask } from "./task/renderTask";
import dynamic from "next/dynamic";
import { TimesheetButton } from "./TimesheetButton";
import { Timesheet } from "./timesheet/Timesheet";

const Projects = dynamic(() => import("./projects/Projects"), { ssr: false });

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
      <Group
        className={clsx("justify-end p-2 items-end", "bg-white dark:bg-black")}
      >
        <Projects />
        <div className="grow" />
        <TimesheetButton />
        {!showTimesheet && <OrientationSelect />}
      </Group>
      {showTimesheet ? (
        <Timesheet />
      ) : (
        <div className="relative">
          {(isFetching || isUpdating) && (
            <Loading className="absolute right-9 top-[7px]" />
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
