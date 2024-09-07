// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any;

export type Task = {
  _id: string;
  title: string;
  order: number;
  [key: string]: Any;
};

export type Column = {
  _id: string;
  title: string;
  tasks?: Task[];
  order: number;
  [key: string]: Any;
};

export type Instruction =
  | { type: "columnAdded"; columnId: string }
  | { type: "columnRemoved"; columnId: string }
  | { type: "columnUpdated"; columnId: string; changes: { [key: string]: Any } }
  | { type: "columnMoved"; columnId: string; toIndex: number }
  | {
      type: "taskAdded";
      columnId: string;
      taskId: string;
      title: string;
      order: number;
    }
  | { type: "taskRemoved"; columnId: string; taskId: string; fromIndex: number }
  | {
      type: "taskUpdated";
      columnId: string;
      taskId: string;
      changes: { [key: string]: Any };
    }
  | { type: "taskMoved"; columnId: string; taskId: string; toIndex: number }
  | {
      type: "taskMovedBetweenColumns";
      taskId: string;
      fromColumnId: string;
      toColumnId: string;
      toIndex: number;
    };

export function generateInstructions(
  prevColumns: Column[],
  newColumns: Column[],
): Instruction[] {
  const instructions: Instruction[] = [];

  const movedTasks = new Set<string>(); // Track tasks that have been moved between columns

  const findColumnByTaskId = (
    columns: Column[],
    taskId: string,
  ): Column | undefined => {
    return columns.find((column) =>
      column.tasks?.some((task) => task._id === taskId),
    );
  };

  prevColumns.forEach((prevColumn, prevIndex) => {
    const newColumn = newColumns.find((col) => col._id === prevColumn._id);

    if (!newColumn) {
      // Column removed
      instructions.push({ type: "columnRemoved", columnId: prevColumn._id });
    } else {
      const newIndex = newColumns.findIndex(
        (col) => col._id === prevColumn._id,
      );
      if (newIndex !== prevIndex) {
        // Column moved to a new position
        instructions.push({
          type: "columnMoved",
          columnId: prevColumn._id,
          toIndex: newIndex,
        });
      }

      // Handle column updates
      const columnUpdates: { [key: string]: Any } = {};
      Object.keys(prevColumn).forEach((key) => {
        if (key !== "tasks" && prevColumn[key] !== newColumn[key]) {
          columnUpdates[key] = newColumn[key];
        }
      });
      if (Object.keys(columnUpdates).length > 0) {
        instructions.push({
          type: "columnUpdated",
          columnId: newColumn._id,
          changes: columnUpdates,
        });
      }

      // Compare tasks in the same column
      prevColumn.tasks?.forEach((prevTask) => {
        const newTask = newColumn.tasks?.find(
          (task) => task._id === prevTask._id,
        );
        if (!newTask) {
          // Task removed from this column
          const targetColumn = findColumnByTaskId(newColumns, prevTask._id);
          if (targetColumn && targetColumn._id !== prevColumn._id) {
            // Task moved to a different column
            instructions.push({
              type: "taskMovedBetweenColumns",
              taskId: prevTask._id,
              fromColumnId: prevColumn._id,
              toColumnId: targetColumn._id,
              toIndex:
                targetColumn.tasks?.findIndex(
                  (task) => task._id === prevTask._id,
                ) || 0,
            });

            // Mark the task as moved
            movedTasks.add(prevTask._id);
          } else {
            instructions.push({
              type: "taskRemoved",
              columnId: prevColumn._id,
              taskId: prevTask._id,
              fromIndex: prevColumn.tasks!.findIndex(
                (task) => task._id === prevTask._id,
              ),
            });
          }
        } else if (prevColumn._id === newColumn._id) {
          // Task moved within the same column
          const prevIndex = prevColumn.tasks?.findIndex(
            (task) => task._id === prevTask._id,
          );
          const newIndex = newColumn.tasks?.findIndex(
            (task) => task._id === newTask._id,
          );
          if (
            prevIndex !== undefined &&
            newIndex !== undefined &&
            prevIndex !== newIndex
          ) {
            // Task moved to a different position within the same column
            if (
              !instructions.some(
                (instruction) =>
                  instruction.type === "taskRemoved" &&
                  instruction.columnId === prevColumn._id &&
                  instruction.fromIndex === newIndex,
              )
            ) {
              instructions.push({
                type: "taskMoved",
                columnId: prevColumn._id,
                taskId: prevTask._id,
                toIndex: newIndex,
              });
            }
          } else {
            // Handle task updates within the same column
            const taskUpdates: { [key: string]: Any } = {};
            Object.keys(prevTask).forEach((key) => {
              if (prevTask[key] !== newTask[key]) {
                taskUpdates[key] = newTask[key];
              }
            });
            if (Object.keys(taskUpdates).length > 0) {
              instructions.push({
                type: "taskUpdated",
                columnId: newColumn._id,
                taskId: newTask._id,
                changes: taskUpdates,
              });
            }
          }
        }
      });

      // Check for new tasks added to the column
      newColumn.tasks?.forEach((newTask) => {
        if (
          prevColumn.tasks &&
          !prevColumn.tasks.some((task) => task._id === newTask._id)
        ) {
          if (!movedTasks.has(newTask._id)) {
            // Only add taskAdded if the task hasn't been moved between columns
            instructions.push({
              type: "taskAdded",
              columnId: newColumn._id,
              taskId: newTask._id,
              title: newTask.title,
              order: newTask.order,
            });
          }
        }
      });

      // Check for type "taskAdded" and "taskMovedBetweenColumns" for the same task
      // If both are present, remove the "taskAdded" instruction
      for (const instruction of instructions) {
        if (instruction.type === "taskAdded") {
          const existingTaskMovedBetweenColumns = instructions.find(
            (i) =>
              i.type === "taskMovedBetweenColumns" &&
              i.taskId === instruction.taskId,
          );
          if (existingTaskMovedBetweenColumns) {
            instructions.splice(
              instructions.findIndex((i) => i === instruction),
              1,
            );
          }
        }
        if (instruction.type === "taskMoved") {
          const existingTaskMovedBetweenColumns = instructions.find(
            (i) =>
              i.type === "taskMovedBetweenColumns" &&
              i.taskId === instruction.taskId,
          );
          if (existingTaskMovedBetweenColumns) {
            instructions.splice(
              instructions.findIndex((i) => i === instruction),
              1,
            );
          }
        }
      }
    }
  });

  // Check for new columns added
  newColumns.forEach((newColumn) => {
    if (!prevColumns.some((column) => column._id === newColumn._id)) {
      instructions.push({ type: "columnAdded", columnId: newColumn._id });
    }
  });

  return instructions;
}
