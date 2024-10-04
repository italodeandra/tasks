// eslint-disable-next-line @typescript-eslint/no-explicit-any
import getObjectDiff from "@italodeandra/next/utils/getObjectDiff";
import { pick } from "lodash-es";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any;

export type Task = {
  _id: string;
  title: string;
  [key: string]: Any;
};

export type Column = {
  _id: string;
  title: string;
  tasks?: Task[];
  order: number;
  [key: string]: Any;
};

function getOrderSorted(numbers: number[]) {
  return numbers
    .sort((a, b) => a - b)
    .map((number, index, array) => {
      if (array[index + 1] === number) {
        return array[index - 1] ? (array[index - 1] + number) / 2 : number - 1;
      }
      return number;
    });
}

export type Instruction =
  | { type: "columnAdded"; columnId: string; title: string; order: number }
  | { type: "columnRemoved"; columnId: string }
  | { type: "columnUpdated"; columnId: string; title?: string; order?: number }
  | {
      type: "taskAdded";
      columnId: string;
      taskId: string;
      title: string;
    }
  | { type: "taskRemoved"; taskId: string }
  | {
      type: "taskUpdated";
      columnId?: string;
      taskId: string;
      title?: string;
    };

export function generateInstructions(
  oldColumns: Column[],
  newColumns: Column[],
): Instruction[] {
  const instructions: Instruction[] = [];

  let newColumnIndex = 0;
  for (const newColumn of newColumns) {
    const sameColumnOnOldColumnsIndex = oldColumns.findIndex(
      (c) => c._id === newColumn._id,
    );
    const sameColumnOnOldColumns = oldColumns[sameColumnOnOldColumnsIndex];
    if (sameColumnOnOldColumns) {
      const columnClone = { ...newColumn };

      columnClone.order = getOrderSorted(
        newColumns.map((column) => column.order),
      )[newColumnIndex];

      const changes: {
        title?: string;
        order?: number;
      } = pick(getObjectDiff(sameColumnOnOldColumns, columnClone), [
        "title",
        "order",
      ]);

      if (Object.keys(changes).length) {
        instructions.push({
          type: "columnUpdated",
          columnId: newColumn._id,
          ...changes,
        });
      }
    } else {
      instructions.push({
        type: "columnAdded",
        columnId: newColumn._id,
        ...pick(newColumn, ["title", "order"]),
      });
    }

    if (newColumn.tasks) {
      for (const newTask of newColumn.tasks) {
        if (sameColumnOnOldColumns?.tasks) {
          const sameTaskOnOldTasksIndex =
            sameColumnOnOldColumns.tasks.findIndex(
              (t) => t._id === newTask._id,
            );
          if (sameTaskOnOldTasksIndex !== -1) {
            const sameTaskOnOldTasks =
              sameColumnOnOldColumns.tasks![sameTaskOnOldTasksIndex];
            if (sameTaskOnOldTasks) {
              const taskClone = { ...newTask };

              const changes: { title?: string } = pick(
                getObjectDiff(sameTaskOnOldTasks, taskClone),
                ["title"],
              );

              if (Object.keys(changes).length) {
                instructions.push({
                  type: "taskUpdated",
                  taskId: newTask._id,
                  ...changes,
                });
              }
            }
          } else {
            const sameTaskInAnotherNewColumn = newColumns
              .find((c) => c.tasks?.some((t) => t._id === newTask._id))
              ?.tasks?.find((t) => t._id === newTask._id);
            const sameTaskInAnotherOldColumn = oldColumns
              .find((c) => c.tasks?.some((t) => t._id === newTask._id))
              ?.tasks?.find((t) => t._id === newTask._id);

            if (!sameTaskInAnotherOldColumn || !sameTaskInAnotherNewColumn) {
              instructions.push({
                type: "taskAdded",
                columnId: newColumn._id,
                taskId: newTask._id,
                ...pick(newTask, ["title"]),
              });
            } else {
              const taskClone = { ...newTask };

              taskClone.columnId = newColumns.find((c) =>
                c.tasks?.some((t) => t._id === newTask._id),
              )?._id;

              const changes: {
                title?: string;
                columnId?: string;
              } = pick(getObjectDiff(sameTaskInAnotherNewColumn, taskClone), [
                "title",
                "columnId",
              ]);

              if (Object.keys(changes).length) {
                instructions.push({
                  type: "taskUpdated",
                  taskId: newTask._id,
                  ...changes,
                });
              }
            }
          }
        } else {
          instructions.push({
            type: "taskAdded",
            columnId: newColumn._id,
            taskId: newTask._id,
            ...pick(newTask, ["title"]),
          });
        }
      }
    }
    if (sameColumnOnOldColumns?.tasks) {
      for (const oldTask of sameColumnOnOldColumns.tasks) {
        const sameTaskOnNewTasks = newColumn.tasks!.find(
          (t) => t._id === oldTask._id,
        );
        if (!sameTaskOnNewTasks) {
          const sameTaskInAnotherColumn = newColumns.find((c) =>
            c.tasks?.some((t) => t._id === oldTask._id),
          );
          if (!sameTaskInAnotherColumn) {
            instructions.push({
              type: "taskRemoved",
              taskId: oldTask._id,
            });
          }
        }
      }
    }

    newColumnIndex++;
  }
  for (const oldColumn of oldColumns) {
    const sameColumnOnNewColumns = newColumns.find(
      (c) => c._id === oldColumn._id,
    );
    if (!sameColumnOnNewColumns) {
      instructions.push({ type: "columnRemoved", columnId: oldColumn._id });
    }
  }

  return instructions;
}
