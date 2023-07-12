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
import _, { isEqual, xor } from "lodash";
import { UniqueIdentifier } from "@dnd-kit/core";
import { Task } from "./Task/Task";
import clsx from "clsx";
import { ColumnTitle } from "./ColumnTitle";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useTaskUpsert } from "../../../pages/api/task/upsert";
import Stack from "@italodeandra/ui/components/Stack/Stack";
import Group from "@italodeandra/ui/components/Group/Group";
import Text from "@italodeandra/ui/components/Text";
import { useProjectList } from "../../../pages/api/project/list";
import { Skeleton } from "@italodeandra/ui/components/Skeleton/Skeleton";

function AddNewTaskButton({ status }: { status: TaskStatus }) {
  let { mutate: upsert, isLoading } = useTaskUpsert();

  let handleAddNewClick = useCallback(() => {
    let newTask = {
      content: "",
      status,
    };
    upsert(newTask);
  }, [status, upsert]);

  return (
    <Button
      leadingIcon={<PlusIcon />}
      onClick={handleAddNewClick}
      loading={isLoading}
    >
      New task
    </Button>
  );
}

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
    (id: UniqueIdentifier, children: ReactElement | null) => (
      <div
        key={id}
        className="relative flex w-[90%] shrink-0 flex-col gap-2 sm:w-96"
      >
        <ColumnTitle
          status={id as TaskStatus}
          isLoading={isLoading || isUpdating}
        />
        {children &&
          cloneElement(children, {
            className: clsx("flex flex-col gap-2", children.props.className),
          })}
        <AddNewTaskButton status={id as TaskStatus} />
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
    <Stack className="h-screen pt-4">
      <Stack className="px-4">
        <Text variant="label">Projects</Text>
        <Group wrap>
          {[{ _id: "", name: "None" }, ...(projects || [])]?.map((project) => (
            <Button
              size="sm"
              key={project._id}
              variant={
                selectedProjects.includes(project._id) ? "filled" : "outlined"
              }
              onClick={() =>
                setSelectedProjects(xor(selectedProjects, [project._id]))
              }
            >
              {project.name}
            </Button>
          ))}
          {isLoadingProjects && <Skeleton className="w-20" />}
        </Group>
      </Stack>
      <div className="relative flex-1 overflow-auto px-4 pb-14">
        <UiKanban
          items={items}
          renderItem={renderItem}
          renderColumn={renderColumn}
          onChange={handleKanbanChange}
          className="gap-2"
        />
      </div>
    </Stack>
  );
}
