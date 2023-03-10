import { TaskListApiResponse } from "../../../pages/api/task/list";
import { useState } from "react";
import { Reorder } from "framer-motion";
import { PlusIcon } from "@heroicons/react/20/solid";
import { TaskStatus } from "../../../collections/task";
import { Task } from "./Task/Task";
import Stack from "@italodeandra/ui/components/Stack/Stack";
import Button from "@italodeandra/ui/components/Button/Button";

export const columns = [TaskStatus.TODO, TaskStatus.DOING, TaskStatus.DONE];

export function Column({
  tasks,
  showAddNewButon,
}: {
  tasks: TaskListApiResponse;
  showAddNewButon?: boolean;
}) {
  let [items, setItems] = useState(tasks);

  return (
    <Reorder.Group values={items} onReorder={setItems}>
      <Stack>
        {items.map((item) => (
          <Task task={item} key={item._id} />
        ))}
        {showAddNewButon && (
          <Button
            leadingIcon={<PlusIcon />}
            className="opacity-50 transition-all hover:opacity-100"
          >
            Add new
          </Button>
        )}
      </Stack>
    </Reorder.Group>
  );
}
