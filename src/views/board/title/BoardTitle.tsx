import { useRouter } from "next/router";
import { boardGetApi } from "../../../pages/api/board/get";
import { MarkdownEditor } from "../../../components/Kanban/MarkdownEditor";
import {
  MouseEvent as RMouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { boardUpdateApi } from "../../../pages/api/board/update";
import Loading from "@italodeandra/ui/components/Loading";
import ContextMenu from "@italodeandra/ui/components/ContextMenu";
import { showDialog } from "@italodeandra/ui/components/Dialog";
import { Projects } from "./projects/Projects";
import { BoardPermissionsDialogContent } from "./permissions/BoardPermissionsDialogContent";
import clsx from "@italodeandra/ui/utils/clsx";
import { reactQueryDialogContentProps } from "../../../utils/reactQueryDialogContentProps";
import { StatusesDialogContent } from "./statuses/StatusesDialogContent";
import Routes from "../../../Routes";
import { omit } from "lodash-es";
import { useAuthGetUser } from "@italodeandra/auth/api/getUser";
import { Assignees } from "./Assignees";

export function BoardTitle({ route }: { route: "board" | "timesheet" }) {
  const router = useRouter();
  const triggerRef = useRef<HTMLDivElement>(null);

  const _id = router.query._id as string;

  const boardGet = boardGetApi.useQuery({ _id });
  const boardUpdate = boardUpdateApi.useMutation();
  const authGetUser = useAuthGetUser();

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
      if (name !== value) {
        setName(value);
        boardUpdate.mutate({
          _id,
          name: value,
        });
      }
    },
    [_id, boardUpdate, name],
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
      contentProps: reactQueryDialogContentProps,
    });
  }, [_id]);

  const handleEditStatusesClick = useCallback(() => {
    showDialog({
      title: "Statuses",
      content: <StatusesDialogContent boardId={_id} />,
      contentProps: reactQueryDialogContentProps,
    });
  }, [_id]);

  const clickTimer = useRef<number>();
  useEffect(() => {
    if (editing) {
      clearTimeout(clickTimer.current);
    }
  }, [editing]);
  const handleClick = useCallback((event: RMouseEvent) => {
    clearTimeout(clickTimer.current);
    clickTimer.current = window.setTimeout(() => {
      setEditing(false);
      triggerRef.current?.dispatchEvent(
        new MouseEvent("contextmenu", omit(event, "view")),
      );
    }, 300);
  }, []);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <div className="-mr-1 mt-[6px] text-sm text-zinc-200">/</div>
        <ContextMenu.Root>
          <ContextMenu.Trigger>
            <MarkdownEditor
              ref={triggerRef}
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
              onClick={handleClick}
            />
          </ContextMenu.Trigger>
          {(boardGet.data?.hasAdminPermission ||
            boardGet.data?.canViewPermissions) && (
            <ContextMenu.Content>
              {boardGet.data?.hasAdminPermission && (
                <>
                  <ContextMenu.Item onClick={() => setEditing(true)}>
                    Rename
                  </ContextMenu.Item>
                  <ContextMenu.Item onClick={handleEditStatusesClick}>
                    Edit statuses
                  </ContextMenu.Item>
                </>
              )}
              {boardGet.data?.canViewPermissions && (
                <ContextMenu.Item onClick={handleEditPermissionsClick}>
                  {boardGet.data?.hasAdminPermission ? "Edit" : "View"}{" "}
                  permissions
                </ContextMenu.Item>
              )}
              {boardGet.data?.hasAdminPermission && route !== "timesheet" && (
                <ContextMenu.Item href={Routes.TimesheetList(_id)}>
                  View timesheet
                </ContextMenu.Item>
              )}
              {boardGet.data?.hasAdminPermission && route !== "board" && (
                <ContextMenu.Item href={Routes.Board(_id)}>
                  View tasks
                </ContextMenu.Item>
              )}
            </ContextMenu.Content>
          )}
        </ContextMenu.Root>
        {boardUpdate.isPending && <Loading className="mt-2" />}
        {route === "board" && authGetUser.data && (
          <>
            <Projects
              boardId={_id}
              canEditBoard={boardGet.data?.hasAdminPermission}
            />
            <Assignees boardId={_id} />
          </>
        )}
      </div>
    </>
  );
}
