import Jsonify from "@italodeandra/next/utils/Jsonify";
import { ITask, TaskStatus } from "../../../../collections/task";
import { useTaskUpsert } from "../../../../pages/api/task/upsert";
import { useTaskList } from "../../../../pages/api/task/list";
import { useCallback } from "react";
import Menu from "@italodeandra/ui/components/Menu/Menu";
import Tooltip from "@italodeandra/ui/components/Tooltip/Tooltip";
import Button from "@italodeandra/ui/components/Button/Button";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { columns } from "../columns.const";
import { translateTaskStatus } from "../translateTaskStatus";

export function TaskOptions({
  className,
  buttonClassName,
  task,
}: {
  className?: string;
  buttonClassName?: string;
  task: Pick<Jsonify<ITask>, "_id" | "content" | "status"> &
    Pick<Partial<Jsonify<ITask>>, "projectId">;
}) {
  let { mutate: taskUpsert } = useTaskUpsert();
  let { data: tasks } = useTaskList();

  let handleMoveStatusClick = useCallback(
    (status: TaskStatus) => () => {
      let firstOrderOfNextStatus = tasks?.find(
        (t) => t.status === status
      )?.order;
      taskUpsert({
        _id: task._id,
        status: status,
        order:
          (firstOrderOfNextStatus !== undefined ? firstOrderOfNextStatus : 1) -
          1,
      });
    },
    [task._id, taskUpsert, tasks]
  );

  return (
    <Menu
      className={className}
      button={
        <span>
          <Tooltip content="Options">
            <Button icon variant="text" className={buttonClassName} size="sm">
              <EllipsisVerticalIcon />
            </Button>
          </Tooltip>
        </span>
      }
    >
      {columns
        .filter((c) => c !== task.status)
        .map((status) => (
          <Menu.Item key={status} onClick={handleMoveStatusClick(status)}>
            Move to {translateTaskStatus(status)}
          </Menu.Item>
        ))}
    </Menu>
  );
}
