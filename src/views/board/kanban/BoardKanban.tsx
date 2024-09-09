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
import { find, isEqual, pick } from "lodash-es";
import useDebouncedValue from "@italodeandra/ui/hooks/useDebouncedValue";
import { boardGetApi } from "../../../pages/api/board/get";
import { parseAsString, useQueryState } from "nuqs";
import Routes from "../../../Routes";
import { useRouter } from "next/router";
import { taskBatchUpdateApi } from "../../../pages/api/task/batch-update";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { reactQueryDialogContentProps } from "../../../utils/reactQueryDialogContentProps";
import { ColumnAdditionalActions } from "./ColumnAdditionalActions";
import { generateInstructions } from "./compareColumns";
import { WritableDeep } from "type-fest";
import { useAuthGetUser } from "@italodeandra/auth/api/getUser";

export function BoardKanban({ boardId }: { boardId: string }) {
  const router = useRouter();
  const [openTaskId, setOpenTaskId] = useQueryState(
    "task",
    parseAsString.withOptions({
      history: "push",
      clearOnDefault: true,
    }),
  );
  const authGetUser = useAuthGetUser();

  const { data, selectedProjects, selectedSubProjects } =
    useSnapshot(boardState);

  useEffect(() => {
    const dialogId = isomorphicObjectId().toString();
    if (openTaskId && authGetUser.data) {
      showDialog({
        _id: dialogId,
        titleClassName: "mb-0",
        contentOverflowClassName: "max-w-screen-xl gap-4",
        title: <TaskDialogTitle taskId={openTaskId} />,
        content: (
          <TaskDialogContent
            dialogId={dialogId}
            taskId={openTaskId}
            boardId={boardId}
          />
        ),
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
      order: list.order,
      tasks: list.cards?.map((card) => ({
        _id: card._id,
        title: card.title,
        order: card.order,
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
      if (data?.some((list) => list.tasks?.some((task) => !task.title))) {
        return;
      }

      const instructions = generateInstructions(
        taskList.data.map((column) => ({
          ...pick(column, "_id", "title", "order"),
          tasks: column.tasks?.map((task) =>
            pick(task, "_id", "title", "order"),
          ),
        })),
        (debouncedData as WritableDeep<typeof debouncedData>).map((column) => ({
          ...pick(column, "_id", "title", "order"),
          tasks: column.tasks?.map((task) =>
            pick(task, "_id", "title", "order"),
          ),
        })),
      );

      if (instructions.length) {
        taskBatchUpdate.mutate({
          boardId,
          instructions,
          selectedProjects: selectedProjects as WritableDeep<
            typeof selectedProjects
          >,
          selectedSubProjects: selectedSubProjects as WritableDeep<
            typeof selectedSubProjects
          >,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedData]);

  const mappedData = useMemo(
    () =>
      (data || taskList.data || []).map((list) => ({
        ...pick(list, "_id", "title", "order"),
        cards: list.tasks?.map((task) => pick(task, "_id", "title", "order")),
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

  return (
    <Kanban
      className="overflow-auto px-2 pb-2"
      data={mappedData}
      onChange={handleDataChange}
      onClickCard={authGetUser.data ? handleTaskClick : undefined}
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
      canMoveCardTo={boardGet.data?.hasAdminPermission}
      canDeleteCard
    />
  );
}
