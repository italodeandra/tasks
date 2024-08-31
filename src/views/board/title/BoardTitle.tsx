import { useRouter } from "next/router";
import { boardGetApi } from "../../../pages/api/board/get";
import { MarkdownEditor } from "../../../components/Kanban/MarkdownEditor";
import { useCallback, useEffect, useState } from "react";
import { boardUpdateApi } from "../../../pages/api/board/update";
import Loading from "@italodeandra/ui/components/Loading";
import ContextMenu from "@italodeandra/ui/components/ContextMenu";
import { showDialog } from "@italodeandra/ui/components/Dialog";
import { Projects } from "./projects/Projects";
import { EditPermissionsDialogContent } from "./EditPermissionsDialogContent";

export function BoardTitle() {
  const router = useRouter();

  const _id = router.query._id as string;

  const boardGet = boardGetApi.useQuery({ _id });
  const boardUpdate = boardUpdateApi.useMutation();

  const [name, setName] = useState(boardGet.data?.name || "");

  useEffect(() => {
    if (name !== boardGet.data?.name) {
      setName(boardGet.data?.name || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardGet.data?.name]);

  const handleChange = useCallback(
    (value: string) => {
      setName(value);
      boardUpdate.mutate({
        _id,
        name: value,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [_id],
  );

  const handleEditPermissionsClick = useCallback(() => {
    showDialog({
      _id: "board-permissions",
      title: "Board permissions",
      content: (
        <EditPermissionsDialogContent
          dialogId="board-permissions"
          boardId={_id}
        />
      ),
    });
  }, [_id]);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <div className="-mr-1 mt-[6px] text-sm">/</div>
        <ContextMenu.Root>
          <ContextMenu.Trigger>
            <MarkdownEditor
              className="mb-auto mt-[7px] rounded px-1 py-0.5 text-xs transition-colors hover:bg-zinc-900"
              value={name}
              onChange={handleChange}
              editOnDoubleClick={boardGet.data?.canEdit}
              editHighlight
            />
          </ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Item onClick={handleEditPermissionsClick}>
              {boardGet.data?.canEdit ? "Edit" : "View"} permissions
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Root>
        {boardUpdate.isPending && <Loading />}
        <Projects boardId={_id} />
      </div>
    </>
  );
}
