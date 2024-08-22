import { Kanban } from "../../components/Kanban/Kanban";
import { useCallback, useEffect, useMemo } from "react";
import { showDialog } from "@italodeandra/ui/components/Dialog";
import { isEqual, omit, pick } from "lodash-es";
import { IList } from "../../components/Kanban/IList";
import { useSnapshot } from "valtio";
import { state } from "./state";
import { TaskDialogTitle } from "./TaskDialogTitle";
import { TaskDialogContent } from "./TaskDialogContent";
import { TaskAdditionalActions } from "./TaskAdditionalActions";
import { TaskAdditionalContent } from "./TaskAdditionalContent";
import { imageUploadApi } from "../../pages/api/image-upload";
import { Header } from "./header/Header";
import { taskListApi } from "../../pages/api/task2/list";
import useDebouncedValue from "@italodeandra/ui/hooks/useDebouncedValue";
import { useQueryClient } from "@tanstack/react-query";
import getArrayDiff from "@italodeandra/next/utils/getArrayDiff";

export function TrelloView() {
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

  const taskList = taskListApi.useQuery();
  useEffect(() => {
    if (!isEqual(taskList.data, data)) {
      state.data = taskList.data || [];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskList.data]);

  const queryClient = useQueryClient();
  const debouncedData = useDebouncedValue(data, "2s");
  useEffect(() => {
    if (taskList.data && !isEqual(debouncedData, taskList.data)) {
      const isStatusOrderChanged = taskList.data.some(
        (status, index) =>
          debouncedData[index] && status._id !== debouncedData[index]?._id,
      );
      console.log("isStatusOrderChanged", isStatusOrderChanged);
      const statusChanges = getArrayDiff(
        taskList.data.map((l) => omit(l, "tasks")),
        debouncedData.map((l) => omit(l, "tasks")),
        "_id",
      );
      console.log("status changes", statusChanges);
      // fake set api changes this should be done on the useMutation hook
      taskListApi.setQueryData(queryClient, debouncedData as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedData]);

  const mappedData = useMemo(
    () =>
      data.map((list) => ({
        ...pick(list, ["_id", "title"]),
        cards: list.tasks?.map((task) => pick(task, ["_id", "title"])),
      })),
    [data],
  );

  return (
    <>
      <Header />
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
    </>
  );
}
