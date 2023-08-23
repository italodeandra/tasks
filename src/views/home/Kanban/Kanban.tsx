import { useTaskList } from "../../../pages/api/task/list";
import React, {
  cloneElement,
  Fragment,
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
import _, { isEqual, xor } from "lodash";
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

export function Kanban() {
  let [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  let { data: projects, isLoading: isLoadingProjects } = useProjectList();
  let { data: tasks, isError, isLoading, refetch } = useTaskList();
  let { mutate: batchUpdate, isLoading: isUpdating } =
    useTaskBatchUpdateOrder();

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
        <Task key={id} task={task} />
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
        <AddNewTaskButton
          status={id as TaskStatus}
          selectedProjects={selectedProjects}
          order={-1}
        />
        {children &&
          cloneElement(children, {
            className: clsx("flex flex-col gap-2", children.props.className),
          })}
        {taskCount > 0 && (
          <AddNewTaskButton
            className="hidden sm:flex"
            status={id as TaskStatus}
            selectedProjects={selectedProjects}
          />
        )}
      </div>
    ),
    [isLoading, isUpdating, selectedProjects]
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
    <Group className="gap-0">
      <NewProjectModal />
      <Stack className="h-screen w-full pt-4">
        <Stack className="px-4">
          <Text variant="label">Projects</Text>
          <Group className="-mx-4 overflow-x-auto px-4 sm:flex-wrap">
            {[{ _id: "", name: "None" }, ...(projects || [])]?.map(
              (project) => (
                <Button
                  size="sm"
                  key={project._id}
                  variant={
                    selectedProjects.includes(project._id)
                      ? "filled"
                      : "outlined"
                  }
                  onClick={() =>
                    setSelectedProjects(xor(selectedProjects, [project._id]))
                  }
                >
                  {project.name}
                </Button>
              )
            )}
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
        <div className="relative w-full flex-1 overflow-auto px-4 pb-14">
          <UiKanban
            items={items}
            renderItem={renderItem}
            renderColumn={renderColumn}
            onChange={handleKanbanChange}
            className="gap-8 sm:gap-2"
          />
        </div>
      </Stack>
      {!!selectedProjects.length && (
        <Stack className="w-96 shrink-0 border-l border-gray-200 p-4">
          {projects
            ?.filter((project) => selectedProjects.includes(project._id))
            .map((project) => (
              <Fragment key={project._id}>
                <Timesheet project={project} />
                <div className="my-2 h-px bg-gray-200 last:hidden" />
              </Fragment>
            ))}
        </Stack>
      )}
    </Group>
  );
}
