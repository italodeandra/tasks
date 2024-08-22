import { Kanban } from "../../components/Kanban/Kanban";
import { useCallback, useMemo } from "react";
import { showDialog } from "@italodeandra/ui/components/Dialog";
import { pick } from "lodash-es";
import { IList } from "../../components/Kanban/IList";
import { useSnapshot } from "valtio";
import { state } from "./state";
import { TaskDialogTitle } from "./TaskDialogTitle";
import { TaskDialogContent } from "./TaskDialogContent";
import { TaskAdditionalActions } from "./TaskAdditionalActions";
import { TaskAdditionalContent } from "./TaskAdditionalContent";
import { imageUploadApi } from "../../pages/api/image-upload";
import { Header } from "./header/Header";

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
