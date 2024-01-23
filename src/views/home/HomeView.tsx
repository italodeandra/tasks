import { useTaskList } from "../../pages/api/task/list";
import { useCallback, useMemo } from "react";
import { Kanban } from "./kanban/Kanban";
import Group from "@italodeandra/ui/components/Group";
import { useSnapshot } from "valtio";
import { homeState } from "./home.state";
import { ITask, renderTask } from "./task/Task";
import { OrientationSelect } from "./OrientationSelect";
import { KanbanSkeleton } from "./kanban/KanbanSkeleton";
import { Projects } from "./Projects";
import clsx from "@italodeandra/ui/utils/clsx";
import { useTaskBatchUpdateOrder } from "../../pages/api/task/batchUpdateOrder";
import Loading from "@italodeandra/ui/components/Loading";
import { TaskStatus } from "../../collections/task";
import { renderColumn } from "./column/Column";
import { isEqual } from "lodash";

export function HomeView() {
  let { orientation } = useSnapshot(homeState);
  let { data: databaseTasks, isLoading } = useTaskList();
  let { mutate: batchUpdate, isLoading: isUpdating } =
    useTaskBatchUpdateOrder();

  let kanbanTasks = useMemo<ITask[] | undefined>(
    () =>
      databaseTasks?.map(({ status, order, titleHtml, ...task }) => ({
        ...task,
        columnId: status,
        index: order,
        content: titleHtml,
      })),
    [databaseTasks]
  );

  let handleKanbanChange = useCallback(
    (tasks: ITask[]) => {
      if (tasks.length && !isEqual(kanbanTasks, tasks)) {
        batchUpdate(
          tasks.map(({ index, columnId, ...task }) => ({
            ...task,
            status: columnId as TaskStatus,
            order: index,
          }))
        );
      }
    },
    [batchUpdate, kanbanTasks]
  );

  return (
    <>
      <Group
        className={clsx("justify-end p-2 items-end", "bg-white dark:bg-black")}
      >
        <Projects />
        <div className="grow" />
        <OrientationSelect />
      </Group>
      <div className="relative">
        {isUpdating && <Loading className="absolute right-2 top-1.5" />}
        {isLoading && <KanbanSkeleton />}
        {kanbanTasks && (
          <Kanban
            orientation={orientation}
            value={kanbanTasks}
            onChangeValue={handleKanbanChange}
            renderColumn={renderColumn}
            renderItem={renderTask}
          />
        )}
      </div>
    </>
  );
}
