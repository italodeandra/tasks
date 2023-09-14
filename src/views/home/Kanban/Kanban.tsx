import { useTaskList } from "../../../pages/api/task/list";
import React, {
  cloneElement,
  ReactElement,
  useCallback,
  useMemo,
  useState,
} from "react";
import { TaskStatus } from "../../../collections/task";
import { useTaskBatchUpdateOrder } from "../../../pages/api/task/batchUpdateOrder";
import Alert from "@italodeandra/ui/components/Alert/Alert";
import Button from "@italodeandra/ui/components/Button/Button";
import { Kanban as UiKanban } from "../../../components/Kanban/Kanban";
import _, { isEqual } from "lodash";
import { UniqueIdentifier } from "@dnd-kit/core";
import { Task } from "./Task/Task";
import clsx from "clsx";
import { ColumnTitle } from "./ColumnTitle";
import Stack from "@italodeandra/ui/components/Stack/Stack";
import Group from "@italodeandra/ui/components/Group/Group";
import Text from "@italodeandra/ui/components/Text";
import { useProjectList } from "../../../pages/api/project/list";
import { Skeleton } from "@italodeandra/ui/components/Skeleton/Skeleton";
import { AddNewTaskButton } from "./AddNewTaskButton";
import { Timesheet } from "./timesheet/Timesheet";
import { NewProjectModal } from "./Task/new-project/NewProjectModal";
import { newProjectState } from "./Task/new-project/newProject.state";
import { PlusIcon } from "@heroicons/react/20/solid";
import { ProjectColor } from "../../../collections/project";
import { useSnapshot } from "valtio";
import { selectedProjectsState } from "./selectedProjects.state";
import { Project } from "./Project";
import { ModeToggle } from "@italodeandra/ui/components/ModeToggle/ModeToggle";
import UserMenu from "../../panel/layout/UserMenu";
import { useTimesheetStatus } from "../../../pages/api/timesheet/status";
import Loading from "@italodeandra/ui/components/Loading/Loading";
import { prettyMilliseconds } from "../../../utils/prettyMilliseconds";
import { Timer } from "./Task/Timer";

function TimesheetStatus() {
  let { data, isLoading } = useTimesheetStatus();

  if (isLoading) {
    return <Loading />;
  }

  if (!data) {
    return null;
  }

  return (
    <Group className="items-center">
      {data.currentClock && <Timer task={data.currentClock} />}
      <div>Today: {prettyMilliseconds(data.todayClockedTime)}</div>
    </Group>
  );
}

export function Kanban() {
  let { selectedProjects } = useSnapshot(selectedProjectsState);
  let { data: projects, isLoading: isLoadingProjects } = useProjectList();
  let { data: tasks, isError, isLoading, refetch } = useTaskList();
  let { mutate: batchUpdate, isLoading: isUpdating } =
    useTaskBatchUpdateOrder();
  let [mobileTimesheetOpen, setMobileTimesheetOpen] = useState(false);

  let items = useMemo(() => {
    return {
      [TaskStatus.TODO]: _(tasks)
        .filter((task) => task.status === TaskStatus.TODO)
        .map("_id")
        .value(),
      [TaskStatus.DOING]: _(tasks)
        .filter((task) => task.status === TaskStatus.DOING)
        .map("_id")
        .value(),
      [TaskStatus.DONE]: _(tasks)
        .filter((task) => task.status === TaskStatus.DONE)
        .map("_id")
        .value(),
    };
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

  return (
    <Group className="h-screen gap-0">
      <NewProjectModal />
      <Stack
        className={clsx(
          "pt-4",
          selectedProjects.length === 1 ? "w-full sm:w-1/2" : "w-full",
          {
            "hidden sm:flex": mobileTimesheetOpen,
          }
        )}
      >
        <div className="flex flex-col-reverse gap-2 px-4 sm:flex-row">
          <Stack>
            <Text variant="label">Projects</Text>
            <Group className="-mx-4 overflow-x-auto px-4 sm:flex-wrap">
              {[
                {
                  _id: "",
                  name: "None",
                  lastTaskUpdatedAt: "",
                  color: ProjectColor.BLUE,
                },
                ...(projects || []),
              ]?.map((project) => (
                <Project key={project._id} project={project} />
              ))}
              {isLoadingProjects ? (
                <Skeleton className="w-20" />
              ) : (
                <Button
                  size="sm"
                  variant="outlined"
                  onClick={() => newProjectState.openModal()}
                  icon
                >
                  <PlusIcon />
                </Button>
              )}
            </Group>
          </Stack>
          <div className="flex-grow" />
          <Group className="mb-auto pb-0">
            <TimesheetStatus />
            <div className="flex-grow sm:hidden"></div>
            <ModeToggle />
            <UserMenu />
          </Group>
        </div>

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
          <div className="px-4 pb-1">
            <Button
              className="w-full"
              onClick={() => setMobileTimesheetOpen(true)}
            >
              Open timesheet
            </Button>
          </div>
        )}
      </Stack>
      {projects && selectedProjects.length === 1 && (
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
          <Timesheet
            project={
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              projects.find((project) =>
                selectedProjects.includes(project._id)
              )!
            }
          />
        </Stack>
      )}
    </Group>
  );
}
