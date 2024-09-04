import { useRouter } from "next/router";
import { boardGetApi } from "../../../pages/api/board/get";
import { MarkdownEditor } from "../../../components/Kanban/MarkdownEditor";
import { useCallback, useEffect, useState } from "react";
import { boardUpdateApi } from "../../../pages/api/board/update";
import Loading from "@italodeandra/ui/components/Loading";
import ContextMenu from "@italodeandra/ui/components/ContextMenu";
import { showDialog } from "@italodeandra/ui/components/Dialog";
import { Projects } from "./projects/Projects";
import { BoardPermissionsDialogContent } from "./edit-permissions/BoardPermissionsDialogContent";
import clsx from "@italodeandra/ui/utils/clsx";

export function BoardTitle() {
  const router = useRouter();

  const _id = router.query._id as string;

  const boardGet = boardGetApi.useQuery({ _id });
  const boardUpdate = boardUpdateApi.useMutation();

  const [editing, setEditing] = useState(false);
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
        <BoardPermissionsDialogContent
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
              className={clsx(
                "mb-auto mt-[7px] rounded px-1 py-0.5 text-xs transition-colors",
                {
                  "hover:bg-zinc-900": boardGet.data?.hasAdminPermission,
                },
              )}
              value={name}
              onChange={
                boardGet.data?.hasAdminPermission ? handleChange : undefined
              }
              editOnDoubleClick={boardGet.data?.hasAdminPermission}
              editHighlight
              editing={editing}
              onChangeEditing={setEditing}
            />
          </ContextMenu.Trigger>
          {(boardGet.data?.hasAdminPermission ||
            boardGet.data?.canViewPermissions) && (
            <ContextMenu.Content>
              {boardGet.data?.hasAdminPermission && (
                <ContextMenu.Item onClick={() => setEditing(true)}>
                  Rename
                </ContextMenu.Item>
              )}
              {boardGet.data?.canViewPermissions && (
                <ContextMenu.Item onClick={handleEditPermissionsClick}>
                  {boardGet.data?.hasAdminPermission ? "Edit" : "View"}{" "}
                  permissions
                </ContextMenu.Item>
              )}
            </ContextMenu.Content>
          )}
        </ContextMenu.Root>
        {boardUpdate.isPending && <Loading className="mt-2" />}
        <Projects
          boardId={_id}
          canEditBoard={boardGet.data?.hasAdminPermission}
        />
      </div>
    </>
  );
}
