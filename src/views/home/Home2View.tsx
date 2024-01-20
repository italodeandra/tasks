import { useSnapshot } from "valtio";
import { state } from "./Kanban2/state";
import { useProjectList } from "../../pages/api/project/list";
import { useTaskList } from "../../pages/api/task/list";
import { useTaskBatchUpdateOrder } from "../../pages/api/task/batchUpdateOrder";
import React, {
  cloneElement,
  ReactElement,
  useCallback,
  useMemo,
  useState,
} from "react";
import { columns } from "./Kanban2/columns.const";
import _, { isEqual } from "lodash";
import { UniqueIdentifier } from "@dnd-kit/core";
import { Task } from "./Kanban2/task/Task";
import { ColumnTitle } from "./Kanban2/ColumnTitle";
import { TaskStatus } from "../../collections/task";
import { AddNewTaskButton } from "./Kanban2/AddNewTaskButton";
import clsx from "clsx";
import Alert from "@italodeandra/ui/components/Alert";
import Button from "@italodeandra/ui/components/Button/Button";
import { NewProjectModal } from "./Kanban2/task/new-project/NewProjectModal";
import Stack from "@italodeandra/ui/components/Stack/Stack";
import { Header } from "./Kanban2/header/Header";
import { Kanban as UiKanban } from "../../components/Kanban/Kanban";
import { Resizable } from "./Kanban2/Resizable";
import { Timesheet } from "./Kanban2/timesheet/Timesheet";
import { Projects } from "./Projects";

export function Home2View() {
  let { selectedProjects, timesheetWidth } = useSnapshot(state);
  let { data: projects } = useProjectList({
    onSuccess(projects) {
      state.selectedProjects = state.selectedProjects.filter((pId) =>
        projects.some((p) => p._id === pId)
      );
    },
  });
  let { data: tasks, isError, isLoading, refetch } = useTaskList();
  let { mutate: batchUpdate, isLoading: isUpdating } =
    useTaskBatchUpdateOrder();
  let [mobileTimesheetOpen, setMobileTimesheetOpen] = useState(false);

  let items = useMemo(() => {
    let items: Record<string, string[]> = {};
    for (let column of columns) {
      items[column] = _(tasks)
        .filter((task) => task.status === column)
        .map("_id")
        .value();
    }
    return items;
  }, [tasks]);
  let getTask = useCallback(
    (id: UniqueIdentifier) => _(tasks).find({ _id: id.toString() }),
    [tasks]
  );
  let renderItem = useCallback(
    (id: UniqueIdentifier) => {
      let task = getTask(id);
      return task &&
        (!task.content ||
          !selectedProjects.length ||
          selectedProjects.includes(task.projectId || "")) ? (
        <Task key={id} task={task} id={id} />
      ) : null;
    },
    [getTask, selectedProjects]
  );

  let renderColumn = useCallback(
    (
      id: UniqueIdentifier,
      children: ReactElement | null,
      taskCount: number
    ) => (
      <div
        key={id}
        className="relative flex w-[90%] shrink-0 flex-col gap-2 sm:w-96"
      >
        <ColumnTitle
          status={id as TaskStatus}
          isLoading={isLoading || isUpdating}
        />
        <AddNewTaskButton status={id as TaskStatus} order={-1} />
        {children &&
          cloneElement(children, {
            className: clsx(
              "flex flex-col gap-2 min-h-96",
              children.props.className
            ),
          })}
        {taskCount > 0 && (
          <AddNewTaskButton
            className="hidden sm:flex"
            status={id as TaskStatus}
          />
        )}
      </div>
    ),
    [isLoading, isUpdating]
  );
  let handleKanbanChange = useCallback(
    (items: Record<string, UniqueIdentifier[]>) => {
      if (tasks?.length) {
        let updatedTasks = _(items)
          .map((itemIds, columnId) =>
            itemIds.map((id, index) => ({
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              ...getTask(id)!,
              status: columnId as TaskStatus,
              order: index,
            }))
          )
          .flatten()
          .filter((task) => !isEqual(task, getTask(task._id)))
          .value();

        if (updatedTasks.length) {
          batchUpdate(updatedTasks);
        }
      }
    },
    [batchUpdate, getTask, tasks]
  );

  if (isError) {
    return (
      <Alert
        title="It was not possible to load the tasks"
        variant="error"
        actions={
          <Button variant="text" onClick={() => refetch()}>
            Try again
          </Button>
        }
      />
    );
  }

  let firstSelectedProject = projects?.find((project) =>
    selectedProjects.includes(project._id)
  );

  return (
    <>
      <NewProjectModal />
      <Stack>
        <Projects />
        <Stack
          className={clsx(
            "overflow-auto pt-4",
            selectedProjects.length === 1 ? "" : "w-full",
            {
              "hidden sm:flex": mobileTimesheetOpen,
            }
          )}
        >
          <Header />

          <div className="relative flex-1 overflow-auto pb-4">
            <UiKanban
              items={items}
              renderItem={renderItem}
              renderColumn={renderColumn}
              onChange={handleKanbanChange}
              className="mx-4 gap-8 sm:gap-2"
            />
          </div>
          {projects && selectedProjects.length === 1 && (
            <div className="px-4 pb-1 sm:hidden">
              <Button
                className="w-full"
                onClick={() => setMobileTimesheetOpen(true)}
              >
                Open timesheet
              </Button>
            </div>
          )}
        </Stack>
        {firstSelectedProject && (
          <Resizable
            minWidth={560}
            maxWidth={1060}
            width={timesheetWidth}
            onResize={(width) => (state.timesheetWidth = width)}
          >
            <Stack
              className={clsx(
                "w-full shrink-0 gap-4 border-zinc-200 p-4 dark:border-zinc-700 sm:flex sm:w-1/2 sm:border-l",
                {
                  hidden: !mobileTimesheetOpen,
                }
              )}
            >
              <Button
                onClick={() => setMobileTimesheetOpen(false)}
                className="sm:hidden"
              >
                Close timesheet
              </Button>
              <Timesheet project={firstSelectedProject} />
            </Stack>
          </Resizable>
        )}
      </Stack>
    </>
  );
}
