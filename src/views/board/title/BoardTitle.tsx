import { useRouter } from "next/router";
import { boardGetApi } from "../../../pages/api/board/get";
import { MarkdownEditor } from "../../../components/Kanban/MarkdownEditor";
import { useCallback, useEffect, useMemo, useState } from "react";
import { boardUpdateApi } from "../../../pages/api/board/update";
import Loading from "@italodeandra/ui/components/Loading";
import ContextMenu from "@italodeandra/ui/components/ContextMenu";
import { showDialog } from "@italodeandra/ui/components/Dialog";
import Input from "@italodeandra/ui/components/Input";
import Button from "@italodeandra/ui/components/Button";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import Select from "@italodeandra/ui/components/Select";
import { boardGetPermissionsApi } from "../../../pages/api/board/get-permissions";
import { PermissionLevel } from "../../../collections/permission";
import getInitials from "@italodeandra/ui/utils/getInitials";
import { UserIcon, UsersIcon } from "@heroicons/react/16/solid";
import { Projects } from "./projects/Projects";

function EditPermissionsDialogContent({ boardId }: { boardId: string }) {
  const boardGetPermissions = boardGetPermissionsApi.useQuery({ _id: boardId });

  const { teams, users, isPublic } = useMemo(() => {
    const users = boardGetPermissions.data?.filter((p) => p.user);
    const teams = boardGetPermissions.data?.filter((p) => p.team);
    const isPublic = boardGetPermissions.data?.some((p) => p.public);

    return {
      users,
      teams,
      isPublic,
    };
  }, [boardGetPermissions.data]);

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="flex gap-2">
        <Input
          placeholder="Invite others by email or team name"
          className="flex-1"
        />
        <Button variant="filled" color="primary">
          Invite
        </Button>
      </div>
      <div className="text-sm">Who has access</div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center text-center text-xs">
            <GlobeAltIcon />
          </div>
          <div className="grow">Anyone with the link</div>
          <Select.Root value={isPublic ? "public" : "private"}>
            <Select.Trigger
              variant="text"
              size="sm"
              trailingClassName="-mr-1"
            />
            <Select.Content>
              <Select.Item value="public">can view</Select.Item>
              <Select.Item value="private">no access</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>
        {teams?.map((team) => (
          <div className="flex items-center gap-2" key={team.team?._id}>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-center text-xs">
              {team.team?.name ? (
                getInitials(team.team.name)
              ) : (
                <UsersIcon className="h-4 w-4" />
              )}
            </div>
            <div className="grow">{team.team?.name}</div>
            <Select.Root value={team.level}>
              <Select.Trigger
                variant="text"
                size="sm"
                trailingClassName="-mr-1"
              />
              <Select.Content>
                <Select.Item value={PermissionLevel.READ}>can view</Select.Item>
                <Select.Item value={PermissionLevel.WRITE}>
                  can edit
                </Select.Item>
                <Select.Item value={PermissionLevel.ADMIN}>admin</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
        ))}
        {users?.map((user) => (
          <div className="flex items-center gap-2" key={user.user?._id}>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-center text-xs">
              {user.user?.name ? (
                getInitials(user.user.name)
              ) : (
                <UserIcon className="h-4 w-4" />
              )}
            </div>
            <div className="grow">
              {user.user?.name}
              {user.isMe ? (
                <>
                  {" "}
                  <span className="opacity-50">(you)</span>
                </>
              ) : null}
            </div>
            <Select.Root value={user.level}>
              <Select.Trigger
                variant="text"
                size="sm"
                trailingClassName="-mr-1"
              />
              <Select.Content>
                <Select.Item value={PermissionLevel.READ}>can view</Select.Item>
                <Select.Item value={PermissionLevel.WRITE}>
                  can edit
                </Select.Item>
                <Select.Item value={PermissionLevel.ADMIN}>admin</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
        ))}
      </div>
    </div>
  );
}

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
      title: "Edit board permissions",
      content: <EditPermissionsDialogContent boardId={_id} />,
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
              Edit permissions
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Root>
        {boardUpdate.isPending && <Loading />}
        <Projects boardId={_id} />
      </div>
    </>
  );
}
