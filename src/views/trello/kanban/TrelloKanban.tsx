import { TaskAdditionalContent } from "./TaskAdditionalContent";
import { TaskAdditionalActions } from "./TaskAdditionalActions";
import { Kanban } from "../../../components/Kanban/Kanban";
import { useSnapshot } from "valtio";
import { state } from "../state";
import { useCallback, useEffect } from "react";
import { showDialog } from "@italodeandra/ui/components/Dialog";
import { TaskDialogTitle } from "./TaskDialogTitle";
import { TaskDialogContent } from "./TaskDialogContent";
import { IList } from "../../../components/Kanban/IList";
import { imageUploadApi } from "../../../pages/api/image-upload";
import { taskBatchUpdateApi } from "../../../pages/api/task2/batch-update";
import { taskListApi } from "../../../pages/api/task2/list";
import { find, isEqual, omit, pick } from "lodash-es";
import { useQueryClient } from "@tanstack/react-query";
import useDebouncedValue from "@italodeandra/ui/hooks/useDebouncedValue";
import getArrayDiff from "@italodeandra/next/utils/getArrayDiff";
import { WritableDeep } from "type-fest";

export function TrelloKanban() {
  const { data } = useSnapshot(state);

  const handleTaskClick = useCallback(
    (selected: { cardId: string; listId: string }) => {
      showDialog({
        titleClassName: "mb-0",
        contentOverflowClassName: "max-w-screen-xl gap-4",
        title: <TaskDialogTitle selected={selected} />,
        content: <TaskDialogContent selected={selected} />,
      });
    },
    [],
  );

  const handleDataChange = useCallback((newData: IList[]) => {
    state.data = newData.map((list) => ({
      _id: list._id,
      title: list.title,
      tasks: list.cards?.map((card) => ({
        _id: card._id,
        title: card.title,
      })),
    }));
  }, []);

  const imageUpload = imageUploadApi.useMutation();
  const uploadClipboardImage = useCallback(
    async (image: string) => {
      const data = await imageUpload.mutateAsync({
        image,
      });
      return data.imageUrl;
    },
    [imageUpload],
  );

  const taskBatchUpdate = taskBatchUpdateApi.useMutation();

  const taskList = taskListApi.useQuery();
  useEffect(() => {
    if (taskList.data && !isEqual(taskList.data, data)) {
      state.data = taskList.data;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskList.data]);

  const queryClient = useQueryClient();
  const debouncedData = useDebouncedValue(data, "1s");
  useEffect(() => {
    if (
      debouncedData &&
      taskList.data &&
      !isEqual(debouncedData, taskList.data)
    ) {
      const isStatusOrderChanged = taskList.data.some(
        (status, index) =>
          debouncedData[index] && status._id !== debouncedData[index]?._id,
      );
      const statusChanges = getArrayDiff(
        taskList.data.map((l) => omit(l, "tasks")),
        debouncedData.map((l) => omit(l, "tasks")),
        "_id",
      );
      const tasksChanges = debouncedData.map((debouncedList) => {
        const list = find(taskList.data, { _id: debouncedList._id });
        const isTasksOrderChanged = !!(
          list &&
          list.tasks?.some(
            (task, index) =>
              debouncedList.tasks?.[index] &&
              task._id !== debouncedList.tasks[index]._id,
          )
        );
        return {
          listId: debouncedList._id,
          isTasksOrderChanged,
          tasksChanges: getArrayDiff(
            list?.tasks || [],
            (debouncedList.tasks as WritableDeep<typeof debouncedList.tasks>) ||
              [],
            "_id",
          ),
        };
      });
      const tasksChangesMoved = (
        tasksChanges as (Omit<(typeof tasksChanges)[0], "tasksChanges"> & {
          tasksChanges: (Omit<
            (typeof tasksChanges)[0]["tasksChanges"][0],
            "type"
          > & {
            type:
              | (typeof tasksChanges)[0]["tasksChanges"][0]["type"]
              | "moved-out"
              | "moved-in";
          })[];
        })[]
      ).map((list, _, tasksChanges) => {
        for (const taskChange of list.tasksChanges) {
          if (taskChange.type === "deleted") {
            const isTaskSomewhereElse = tasksChanges.find((status) =>
              status.tasksChanges.find(
                (task) =>
                  ["inserted", "moved-in"].includes(task.type) &&
                  task.after?._id === taskChange.before?._id,
              ),
            );
            if (isTaskSomewhereElse) {
              taskChange.type = "moved-out";
            }
          } else if (taskChange.type === "inserted") {
            const isTaskSomewhereElse = tasksChanges.find((status) =>
              status.tasksChanges.find(
                (task) =>
                  ["deleted", "moved-out"].includes(task.type) &&
                  task.before?._id === taskChange.after?._id,
              ),
            );
            if (isTaskSomewhereElse) {
              taskChange.type = "moved-in";
            }
          }
        }
        return list;
      });

      (async () => {
        const previousData = taskListApi.getQueryData(queryClient);
        taskListApi.setQueryData(
          queryClient,
          debouncedData as WritableDeep<typeof debouncedData>,
        );
        try {
          await taskBatchUpdate.mutateAsync({
            statusOrderChange: isStatusOrderChanged
              ? debouncedData.map((l) => l._id)
              : undefined,
            statusChanges: statusChanges.length
              ? statusChanges.map((s) => {
                  const status = (
                    ["inserted", "updated"].includes(s.type)
                      ? s.after
                      : s.before
                  )!;
                  return {
                    type: s.type,
                    _id: status._id,
                    title: ["inserted", "updated"].includes(s.type)
                      ? status.title
                      : undefined,
                  };
                })
              : undefined,
            tasksChanges: tasksChangesMoved.length
              ? tasksChangesMoved.map((s) => {
                  return {
                    _id: s.listId,
                    tasksOrderChange: s.isTasksOrderChanged
                      ? debouncedData
                          .find((l) => l._id === s.listId)
                          ?.tasks?.map((t) => t._id)
                      : undefined,
                    tasks: s.tasksChanges.length
                      ? s.tasksChanges.map((t) => {
                          const task = (
                            ["inserted", "updated", "moved-in"].includes(t.type)
                              ? t.after
                              : t.before
                          )!;
                          return {
                            _id: task._id,
                            type: t.type,
                            title: ["inserted", "updated"].includes(t.type)
                              ? task.title
                              : undefined,
                          };
                        })
                      : undefined,
                  };
                })
              : undefined,
          });
        } catch (e) {
          console.error(e);
          taskListApi.setQueryData(queryClient, previousData);
        } finally {
          void taskListApi.invalidateQueries(queryClient);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedData]);

  const mappedData = (data || taskList.data || []).map((list) => ({
    ...pick(list, ["_id", "title"]),
    cards: list.tasks?.map((task) => pick(task, ["_id", "title"])),
  }));

  return (
    <Kanban
      className="px-2 pb-2"
      data={mappedData}
      onChange={handleDataChange}
      onClickCard={handleTaskClick}
      cardName="task"
      listName="status"
      cardAdditionalContent={TaskAdditionalContent}
      cardAdditionalActions={TaskAdditionalActions}
      uploadClipboardImage={uploadClipboardImage}
    />
  );
}
