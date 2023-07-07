import { useTaskList } from "../../../pages/api/task/list";
import React, { cloneElement, ReactElement, useCallback, useMemo } from "react";
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
import { PlusIcon } from "@heroicons/react/20/solid";
import { useTaskUpsert } from "../../../pages/api/task/upsert";

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
  let { data: tasks, isError, isLoading, refetch } = useTaskList();
  let { mutate: batchUpdate, isLoading: isUpdating } =
    useTaskBatchUpdateOrder();

  let items = useMemo(() => {
    return {
      [TaskStatus.TODO]: _(tasks)
        .filter({ status: TaskStatus.TODO })
        .map("_id")
        .value(),
      [TaskStatus.DOING]: _(tasks)
        .filter({ status: TaskStatus.DOING })
        .map("_id")
        .value(),
      [TaskStatus.DONE]: _(tasks)
        .filter({ status: TaskStatus.DONE })
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
      return task && <Task key={id} task={task} />;
    },
    [getTask]
  );

  let renderColumn = useCallback(
    (id: UniqueIdentifier, children: ReactElement | null) => (
      <div key={id} className="flex w-[90%] shrink-0 flex-col gap-2 sm:w-96">
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
    <UiKanban
      items={items}
      renderItem={renderItem}
      renderColumn={renderColumn}
      className="gap-2 px-4"
      onChange={handleKanbanChange}
    />
  );
}
