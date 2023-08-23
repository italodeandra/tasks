import Jsonify from "@italodeandra/next/utils/Jsonify";
import { ITask, TaskStatus } from "../../../../collections/task";
import { useTaskUpsert } from "../../../../pages/api/task/upsert";
import { useCallback, useEffect } from "react";
import Menu from "@italodeandra/ui/components/Menu/Menu";
import Tooltip from "@italodeandra/ui/components/Tooltip/Tooltip";
import Button from "@italodeandra/ui/components/Button/Button";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { columns } from "../columns.const";
import { translateTaskStatus } from "../translateTaskStatus";

export function TaskOptions({
  task,
  onEditClick,
}: {
  task: Pick<Jsonify<ITask>, "_id" | "content" | "status" | "order"> &
    Pick<Partial<Jsonify<ITask>>, "projectId">;
  onEditClick?: () => void;
}) {
  let { mutate: taskUpsert } = useTaskUpsert();

  let handleMoveStatusClick = useCallback(
    (status: TaskStatus) => () =>
      taskUpsert({
        _id: task._id,
        status: status,
        order: 0,
      }),
    [task._id, taskUpsert]
  );

  let handleDeleteClick = useCallback(() => {
    taskUpsert({
      _id: task._id,
      content: "",
    });
  }, [task._id, taskUpsert]);

  useEffect(() => {
    if (!task.content) {
      handleDeleteClick?.();
    }
  }, [handleDeleteClick, task.content]);

  return (
    <Menu
      data-no-dnd="true"
      className="!absolute right-2.5 top-2.5"
      button={
        <span className="block rounded bg-white opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100 group-focus:opacity-100 dark:bg-zinc-900">
          <Tooltip content="Options">
            <Button icon variant="text" size="sm">
              <EllipsisVerticalIcon />
            </Button>
          </Tooltip>
        </span>
      }
    >
      <Menu.Item className="sm:hidden" onClick={onEditClick}>
        Edit
      </Menu.Item>
      {columns
        .filter((c) => c !== task.status)
        .map((status) => (
          <Menu.Item key={status} onClick={handleMoveStatusClick(status)}>
            Move to {translateTaskStatus(status)}
          </Menu.Item>
        ))}
      <Menu.Item onClick={handleDeleteClick}>Delete</Menu.Item>
      <Menu.Item
        onClick={() => {
          let newTask = {
            content: "",
            status: task.status,
            order: task.order - 1,
          };
          taskUpsert(newTask);
        }}
      >
        Create new task above
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          let newTask = {
            content: "",
            status: task.status,
            order: task.order + 1,
          };
          taskUpsert(newTask);
        }}
      >
        Create new task below
      </Menu.Item>
    </Menu>
  );
}
