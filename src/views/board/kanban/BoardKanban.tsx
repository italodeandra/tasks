import { TaskAdditionalContent } from "./TaskAdditionalContent";
import { TaskAdditionalActions } from "./TaskAdditionalActions";
import { Kanban } from "../../../components/Kanban/Kanban";
import { useSnapshot } from "valtio";
import { boardState } from "../board.state";
import { useCallback, useEffect, useMemo } from "react";
import { closeDialog, showDialog } from "@italodeandra/ui/components/Dialog";
import { TaskDialogTitle } from "./task-dialog/TaskDialogTitle";
import { TaskDialogContent } from "./task-dialog/TaskDialogContent";
import { IList } from "../../../components/Kanban/IList";
import { imageUploadApi } from "../../../pages/api/image-upload";
import { taskListApi } from "../../../pages/api/task/list";
import { find, isEqual, omit, pick } from "lodash-es";
import useDebouncedValue from "@italodeandra/ui/hooks/useDebouncedValue";
import getArrayDiff from "@italodeandra/next/utils/getArrayDiff";
import { boardGetApi } from "../../../pages/api/board/get";
import { parseAsString, useQueryState } from "nuqs";
import Routes from "../../../Routes";
import { useRouter } from "next/router";
import { taskBatchUpdateApi } from "../../../pages/api/task/batch-update";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { reactQueryDialogContentProps } from "../../../utils/reactQueryDialogContentProps";
import { ColumnAdditionalActions } from "./ColumnAdditionalActions";

export function BoardKanban({ boardId }: { boardId: string }) {
  const router = useRouter();
  const [openTaskId, setOpenTaskId] = useQueryState(
    "task",
    parseAsString.withOptions({
      history: "push",
      clearOnDefault: true,
    }),
  );

  const { data, selectedProjects, selectedSubProjects } =
    useSnapshot(boardState);

  useEffect(() => {
    const dialogId = isomorphicObjectId().toString();
    if (openTaskId) {
      showDialog({
        _id: dialogId,
        titleClassName: "mb-0",
        contentOverflowClassName: "max-w-screen-xl gap-4",
        title: <TaskDialogTitle taskId={openTaskId} />,
        content: <TaskDialogContent taskId={openTaskId} boardId={boardId} />,
        closeButtonClassName: "bg-zinc-900 dark:hover:bg-zinc-800",
        onClose: () => void setOpenTaskId(null),
        contentProps: reactQueryDialogContentProps,
      });
      return () => {
        closeDialog(dialogId);
      };
    } else {
      closeDialog(dialogId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openTaskId]);

  const handleTaskClick = useCallback(
    (selected: { cardId: string; listId: string }) => {
      void setOpenTaskId(selected.cardId);
    },
    [setOpenTaskId],
  );

  const handleDataChange = useCallback((newData: IList[]) => {
    boardState.data = newData.map((list) => ({
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

  const boardGet = boardGetApi.useQuery({ _id: boardId });
  useEffect(() => {
    if (boardGet.isError || boardGet.failureReason?.message === "Not Found") {
      void router.push(Routes.Home);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardGet.isError, boardGet.failureReason]);
  const taskBatchUpdate = taskBatchUpdateApi.useMutation();

  const taskList = taskListApi.useQuery({
    boardId,
    selectedProjects: selectedProjects as string[],
    selectedSubProjects: selectedSubProjects as string[],
  });
  useEffect(() => {
    if (taskList.data && !isEqual(taskList.data, data)) {
      boardState.data = taskList.data;
      return () => {
        boardState.data = undefined;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskList.data]);

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
        const omittedTasks =
          list?.tasks?.map((t) => pick(t, "_id", "title")) || [];
        const omittedTasks2 =
          debouncedList.tasks?.map((t) => pick(t, "_id", "title")) || [];
        return {
          listId: debouncedList._id,
          isTasksOrderChanged,
          tasksChanges: getArrayDiff(omittedTasks, omittedTasks2, "_id"),
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

      taskBatchUpdate.mutate({
        boardId,
        columnOrderChange: isStatusOrderChanged
          ? debouncedData.map((l) => l._id)
          : undefined,
        columnChanges: statusChanges.length
          ? statusChanges.map((s) => {
              const status = (
                ["inserted", "updated"].includes(s.type) ? s.after : s.before
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
          ? tasksChangesMoved
              .map((s) => {
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
                          projectId:
                            t.type === "inserted" &&
                            selectedProjects[0] &&
                            selectedProjects[0] !== "__NONE__"
                              ? selectedProjects[0]
                              : undefined,
                        };
                      })
                    : undefined,
                };
              })
              .filter((list) => list.tasks?.length)
          : undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedData]);

  const mappedData = useMemo(
    () =>
      (data || taskList.data || []).map((list) => ({
        ...pick(list, ["_id", "title"]),
        cards: list.tasks?.map((task) => pick(task, ["_id", "title"])),
      })),
    [data, taskList.data],
  );

  const checkCanEditTask = useCallback(
    (listId: string, cardId: string) => {
      const list2 = find(taskList.data, { _id: listId });
      const task = find(list2?.tasks, { _id: cardId });
      return task?.canEdit;
    },
    [taskList.data],
  );

  const checkCanDeleteTask = useCallback(
    (listId: string, cardId: string) => {
      const list2 = find(taskList.data, { _id: listId });
      const task = find(list2?.tasks, { _id: cardId });
      return task?.canDelete;
    },
    [taskList.data],
  );

  return (
    <Kanban
      className="overflow-auto px-2 pb-2"
      data={mappedData}
      onChange={handleDataChange}
      onClickCard={handleTaskClick}
      cardName="task"
      listName="column"
      cardAdditionalContent={TaskAdditionalContent}
      cardAdditionalProps={useMemo(
        () => ({ boardId, canEdit: boardGet.data?.hasAdminPermission }),
        [boardGet.data?.hasAdminPermission, boardId],
      )}
      listAdditionalProps={useMemo(
        () => ({ boardId, canEdit: boardGet.data?.hasAdminPermission }),
        [boardGet.data?.hasAdminPermission, boardId],
      )}
      cardAdditionalActions={TaskAdditionalActions}
      listAdditionalActions={ColumnAdditionalActions}
      uploadClipboardImage={uploadClipboardImage}
      canAddList={boardGet.data?.hasAdminPermission}
      canEditList={boardGet.data?.hasAdminPermission}
      canMoveList={boardGet.data?.hasAdminPermission}
      canMoveCard={boardGet.data?.hasAdminPermission}
      canAddCard={
        boardGet.data?.hasAdminPermission && selectedProjects.length <= 1
      }
      canEditCard={checkCanEditTask}
      canDuplicateCard={boardGet.data?.hasAdminPermission}
      canDeleteCard={checkCanDeleteTask}
    />
  );
}
