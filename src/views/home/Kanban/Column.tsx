import { TaskListApiResponse } from "../../../pages/api/task/list";
import { useCallback, useEffect, useRef, useState } from "react";
import { Reorder } from "framer-motion";
import { PlusIcon } from "@heroicons/react/20/solid";
import { ITask, TaskStatus } from "../../../collections/task";
import { Task } from "./Task/Task";
import Stack from "@italodeandra/ui/components/Stack/Stack";
import Button from "@italodeandra/ui/components/Button/Button";
import Jsonify from "@italodeandra/next/utils/Jsonify";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { useTaskUpsert } from "../../../pages/api/task/upsert";
import { useTaskBatchUpdateOrder } from "../../../pages/api/task/batchUpdateOrder";

export function Column({
  tasks,
  showAddNewButon,
  status,
}: {
  tasks: TaskListApiResponse;
  showAddNewButon?: boolean;
  status: TaskStatus;
}) {
  let [items, setItems] =
    useState<
      Pick<
        Jsonify<ITask>,
        "_id" | "content" | "status" | "projectId" | "order"
      >[]
    >(tasks);

  useEffect(() => {
    setItems(tasks);
  }, [tasks]);

  let { mutate: upsert } = useTaskUpsert();
  let handleAddNewClick = useCallback(() => {
    let newTask = {
      _id: isomorphicObjectId().toString(),
      content: "",
      status,
      order: items.length,
    };
    setItems((i) => [...i, newTask]);
    upsert(newTask);
  }, [items.length, status, upsert]);

  let { mutate: batchUpdateOrder } = useTaskBatchUpdateOrder(status);

  let batchUpdateOrderTimer = useRef<ReturnType<typeof setTimeout>>();
  let handleReorder = useCallback(
    (reorderedItems: typeof items) => {
      setItems(reorderedItems);
      clearTimeout(batchUpdateOrderTimer.current);
      batchUpdateOrderTimer.current = setTimeout(
        () =>
          batchUpdateOrder(
            reorderedItems.map((item, index) => ({ ...item, order: index }))
          ),
        1000
      );
    },
    [batchUpdateOrder]
  );

  return (
    <Reorder.Group values={items} onReorder={handleReorder}>
      <Stack>
        {items.map((item) => (
          <Task task={item} key={item._id} />
        ))}
        {showAddNewButon && (
          <Button
            leadingIcon={<PlusIcon />}
            className="opacity-40 !transition-[color,background,border,opacity] hover:!opacity-100 focus:!opacity-100 dark:opacity-10"
            onClick={handleAddNewClick}
          >
            Add new
          </Button>
        )}
      </Stack>
    </Reorder.Group>
  );
}
