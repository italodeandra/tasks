/* eslint-disable no-case-declarations */
import { Any, Column, Instruction, Task } from "./compareColumns";

type BulkWriteOperation = {
  insertOne?: { document: Column | Task };
  deleteOne?: { filter: { _id: string } };
  updateOne?: {
    filter: { _id: string };
    update: { $set: { [key: string]: Any } };
  };
};

export function generateMongoBulkWrites(
  columns: Column[],
  instructions: Instruction[],
): { columnOps: BulkWriteOperation[]; taskOps: BulkWriteOperation[] } {
  const columnOps: BulkWriteOperation[] = [];
  const taskOps: BulkWriteOperation[] = [];

  const getColumnById = (
    columns: Column[],
    columnId: string,
  ): Column | undefined => {
    return columns.find((c) => c._id === columnId);
  };

  const getTaskById = (tasks: Task[], taskId: string): Task | undefined => {
    return tasks.find((t) => t._id === taskId);
  };

  instructions.forEach((instruction) => {
    switch (instruction.type) {
      case "columnAdded":
        const addedColumn = getColumnById(columns, instruction.columnId);
        if (addedColumn) {
          columnOps.push({
            insertOne: { document: addedColumn },
          });
        }
        break;

      case "columnRemoved":
        columnOps.push({
          updateOne: {
            filter: { _id: instruction.columnId },
            update: {
              $set: {
                archived: true,
              },
            },
          },
        });
        break;

      case "columnUpdated":
        columnOps.push({
          updateOne: {
            filter: { _id: instruction.columnId },
            update: { $set: instruction.changes },
          },
        });
        break;

      case "columnMoved":
        const currentColumn = getColumnById(columns, instruction.columnId);
        if (currentColumn) {
          columnOps.push({
            updateOne: {
              filter: { _id: currentColumn._id },
              update: { $set: { order: instruction.toIndex } },
            },
          });
        }
        break;

      case "taskAdded":
        taskOps.push({
          insertOne: {
            document: {
              _id: instruction.taskId,
              columnId: instruction.columnId,
              title: instruction.title,
              order: instruction.order,
            },
          },
        });
        break;

      case "taskRemoved":
        taskOps.push({
          updateOne: {
            filter: { _id: instruction.taskId },
            update: {
              $set: {
                archived: true,
              },
            },
          },
        });
        break;

      case "taskUpdated":
        taskOps.push({
          updateOne: {
            filter: { _id: instruction.taskId },
            update: { $set: instruction.changes },
          },
        });
        break;

      case "taskMoved":
        const taskColumn = getColumnById(columns, instruction.columnId);
        if (taskColumn && taskColumn.tasks) {
          const taskToMove = getTaskById(taskColumn.tasks, instruction.taskId);
          const orders = taskColumn.tasks.map((task) => task.order).sort();

          if (taskToMove) {
            // Update the order of the task within the same column
            taskOps.push({
              updateOne: {
                filter: { _id: taskToMove._id },
                update: {
                  $set: {
                    order:
                      orders[instruction.toIndex] ||
                      orders[orders.length - 1] + 1,
                  },
                },
              },
            });
          }
        }
        break;

      case "taskMovedBetweenColumns":
        const fromColumn = getColumnById(columns, instruction.fromColumnId);
        const toColumn = getColumnById(columns, instruction.toColumnId);

        if (fromColumn && toColumn) {
          const taskToMove = getTaskById(
            fromColumn.tasks || [],
            instruction.taskId,
          );

          if (taskToMove && toColumn.tasks) {
            const orders = toColumn.tasks.map((task) => task.order).sort();

            // Update the task's columnId and order to reflect the move
            taskOps.push({
              updateOne: {
                filter: { _id: taskToMove._id },
                update: {
                  $set: {
                    columnId: instruction.toColumnId,
                    order:
                      orders[instruction.toIndex] ||
                      orders[orders.length - 1] + 1,
                  },
                },
              },
            });
          }
        } else {
          console.error(
            `Column not found: from ${instruction.fromColumnId} to ${instruction.toColumnId}`,
          );
        }
        break;

      default:
        // @ts-expect-error trust me
        console.error(`Unknown instruction type: ${instruction.type}`);
        break;
    }
  });

  return { columnOps, taskOps };
}
