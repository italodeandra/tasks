import {
  BoardGetPermissionsApi,
  boardGetPermissionsApi,
} from "../../../../pages/api/board/get-permissions";
import { useCallback, useEffect, useMemo } from "react";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import Select from "@italodeandra/ui/components/Select";
import { TeamAvatarAndName } from "../../../../components/TeamAvatarAndName";
import { PermissionLevel } from "../../../../collections/permission";
import { UserAvatarAndName } from "../../../../components/UserAvatarAndName";
import ConfirmationButton from "@italodeandra/ui/components/ConfirmationButton";
import { boardLeaveApi } from "../../../../pages/api/board/leave";
import { boardUpdatePermissionApi } from "../../../../pages/api/board/update-permission";
import { closeDialog } from "@italodeandra/ui/components/Dialog";
import { boardGetApi } from "../../../../pages/api/board/get";
import { Invite } from "./Invite";

export function EditPermissionsDialogContent({
  dialogId,
  boardId,
}: {
  dialogId: string;
  boardId: string;
}) {
  const boardGetPermissions = boardGetPermissionsApi.useQuery({ _id: boardId });

  const boardGet = boardGetApi.useQuery({ _id: boardId });
  useEffect(() => {
    if (boardGet.isError || boardGet.failureReason?.message === "Not Found") {
      closeDialog(dialogId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardGet.isError, boardGet.failureReason]);

  const canEdit = !!boardGet.data?.canEdit;

  const { teams, users, isPublic } = useMemo(() => {
    const users = boardGetPermissions.data
      ?.filter((p) => p.user)
      .map((p) => ({
        ...p,
        user: p.user!,
      }));
    const teams = boardGetPermissions.data
      ?.filter((p) => p.team)
      .map((p) => ({
        ...p,
        team: p.team!,
      }));
    const isPublic = boardGetPermissions.data?.some((p) => p.public);

    return {
      users,
      teams,
      isPublic,
    };
  }, [boardGetPermissions.data]);

  const boardLeave = boardLeaveApi.useMutation();

  const boardUpdatePermission = boardUpdatePermissionApi.useMutation();
  const handlePermissionChange = useCallback(
    (permission: BoardGetPermissionsApi["Response"][0]) =>
      (level: PermissionLevel) => {
        boardUpdatePermission.mutate({
          boardId,
          userId: permission.user?._id,
          teamId: permission.team?._id,
          level,
        });
      },
    [boardId, boardUpdatePermission],
  );

  return (
    <div className="flex flex-col gap-2 pt-2">
      {canEdit && <Invite boardId={boardId} className="mb-2" />}
      <div className="text-sm">Who has access</div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center text-center text-xs">
            <GlobeAltIcon />
          </div>
          <div className="grow">Anyone with the link</div>
          {/*TODO public board*/}
          <Select.Root
            value={isPublic ? "public" : "private"}
            disabled={!canEdit}
          >
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
        {users?.map((permission) => (
          <div className="flex items-center gap-2" key={permission.user._id}>
            <UserAvatarAndName {...permission.user} className="grow" />
            {canEdit || !permission.user.isMe ? (
              <Select.Root
                value={permission.level}
                onValueChange={handlePermissionChange(permission)}
                disabled={!canEdit}
              >
                <Select.Trigger
                  variant="text"
                  size="sm"
                  trailingClassName="-mr-1"
                />
                <Select.Content>
                  <Select.Item value={PermissionLevel.READ}>
                    can view
                  </Select.Item>
                  <Select.Item value={PermissionLevel.WRITE}>
                    can edit
                  </Select.Item>
                  <Select.Item value={PermissionLevel.ADMIN}>admin</Select.Item>
                  {!permission.user.isMe && (
                    <Select.Item value="remove">remove</Select.Item>
                  )}
                </Select.Content>
              </Select.Root>
            ) : (
              <ConfirmationButton
                onConfirm={() => {
                  boardLeave.mutate({
                    _id: boardId,
                  });
                }}
                confirmation="Are you sure you want to leave this board?"
                label="Leave"
                position="bottom-right"
                loading={boardLeave.isPending}
                buttonProps={{
                  variant: "text",
                  size: "sm",
                  className: "lowercase",
                }}
              />
            )}
          </div>
        ))}
        {teams?.map((permission) => (
          <div className="flex items-center gap-2" key={permission.team._id}>
            <TeamAvatarAndName {...permission.team} className="grow" />
            <Select.Root
              value={permission.level}
              onValueChange={handlePermissionChange(permission)}
              disabled={!canEdit}
            >
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
                <Select.Item value="remove">remove</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
        ))}
      </div>
    </div>
  );
}
