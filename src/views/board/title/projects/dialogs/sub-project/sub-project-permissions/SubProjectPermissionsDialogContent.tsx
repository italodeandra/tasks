import { useCallback, useEffect, useMemo } from "react";
import {
  GlobeAltIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import Select from "@italodeandra/ui/components/Select";
import { closeDialog } from "@italodeandra/ui/components/Dialog";
import { PermissionLevel } from "../../../../../../../collections/permission";
import { UserAvatarAndName } from "../../../../../../../components/UserAvatarAndName";
import { TeamAvatarAndName } from "../../../../../../../components/TeamAvatarAndName";
import { SubProjectInvite } from "./SubProjectInvite";
import { ProjectPermissionsListApi } from "../../../../../../../pages/api/project/permissions/list";
import { projectListWithSubProjectsApi } from "../../../../../../../pages/api/project/list-with-sub-projects";
import Button from "@italodeandra/ui/components/Button";
import { subProjectPermissionsListApi } from "../../../../../../../pages/api/sub-project/permissions/list";
import { subProjectPermissionsUpdateApi } from "../../../../../../../pages/api/sub-project/permissions/update";
import { subProjectPermissionsClearApi } from "../../../../../../../pages/api/sub-project/permissions/clear";
import { subProjectPermissionsCreateApi } from "../../../../../../../pages/api/sub-project/permissions/create";

export function SubProjectPermissionsDialogContent({
  dialogId,
  boardId,
  subProjectId,
}: {
  dialogId: string;
  boardId: string;
  subProjectId: string;
}) {
  const subProjectPermissionsList = subProjectPermissionsListApi.useQuery({
    subProjectId,
  });

  const projectListWithSubProjects = projectListWithSubProjectsApi.useQuery({
    boardId,
  });

  const subProject = useMemo(
    () =>
      projectListWithSubProjects.data
        ?.find((p) => p.subProjects.find((sp) => sp._id === subProjectId))
        ?.subProjects.find((sp) => sp._id === subProjectId),
    [subProjectId, projectListWithSubProjects.data],
  );

  useEffect(() => {
    if (!subProject) {
      closeDialog(dialogId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subProject]);

  const canEdit = subProject?.canEdit;

  const { isInheritingFromProject, teams, users, isPublic } = useMemo(() => {
    const users = subProjectPermissionsList.data
      ?.filter((p) => p.user)
      .map((p) => ({
        ...p,
        user: p.user!,
      }));
    const teams = subProjectPermissionsList.data
      ?.filter((p) => p.team)
      .map((p) => ({
        ...p,
        team: p.team!,
      }));
    const isPublic = subProjectPermissionsList.data?.some((p) => p.public);

    return {
      isInheritingFromProject: !subProjectPermissionsList.data?.length,
      users,
      teams,
      isPublic,
    };
  }, [subProjectPermissionsList.data]);

  const subProjectPermissionsUpdate =
    subProjectPermissionsUpdateApi.useMutation();
  const handlePermissionChange = useCallback(
    (permission: ProjectPermissionsListApi["Response"][0]) =>
      (level: PermissionLevel) => {
        subProjectPermissionsUpdate.mutate({
          subProjectId,
          userId: permission.user?._id,
          teamId: permission.team?._id,
          level,
          public: permission.public,
        });
      },
    [subProjectId, subProjectPermissionsUpdate],
  );
  const handlePublicPermissionChange = useCallback(
    (level: "public" | "private") => {
      subProjectPermissionsUpdate.mutate({
        subProjectId,
        public: level === "public",
        level: PermissionLevel.READ,
      });
    },
    [subProjectId, subProjectPermissionsUpdate],
  );

  const subProjectPermissionsCreate =
    subProjectPermissionsCreateApi.useMutation();
  const handleCreateProjectOwnPermissionsClick = useCallback(() => {
    subProjectPermissionsCreate.mutate({
      subProjectId,
    });
  }, [subProjectId, subProjectPermissionsCreate]);

  const subProjectPermissionsClear =
    subProjectPermissionsClearApi.useMutation();
  const handleResetToMainProjectPermissions = useCallback(() => {
    subProjectPermissionsClear.mutate({
      subProjectId,
    });
  }, [subProjectPermissionsClear, subProjectId]);

  return (
    <div className="flex flex-col gap-2 pt-2">
      {isInheritingFromProject ? (
        <>
          <div className="flex items-center gap-1 rounded-lg bg-zinc-950 p-2 text-zinc-300">
            <InformationCircleIcon className="h-6 w-6" />
            This sub project is inheriting permissions from the main project.
          </div>
          {canEdit && (
            <Button
              onClick={handleCreateProjectOwnPermissionsClick}
              loading={subProjectPermissionsCreate.isPending}
            >
              Create sub project own permissions
            </Button>
          )}
        </>
      ) : (
        <>
          {canEdit && (
            <SubProjectInvite subProjectId={subProjectId} className="mb-2" />
          )}
          <div className="text-sm">Who has access</div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <div className="flex h-6 w-6 items-center justify-center text-center text-xs">
                <GlobeAltIcon />
              </div>
              <div className="grow">Anyone with the link</div>
              <Select.Root
                value={isPublic ? "public" : "private"}
                onValueChange={handlePublicPermissionChange}
              >
                <Select.Trigger
                  variant="text"
                  size="sm"
                  trailingClassName="-mr-1"
                  loading={
                    subProjectPermissionsUpdate.isPending &&
                    subProjectPermissionsUpdate.variables.public !== undefined
                  }
                  readOnly={!canEdit}
                />
                <Select.Content>
                  <Select.Item value="public">can view</Select.Item>
                  <Select.Item value="private">no access</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>
            {users?.map((permission) => (
              <div
                className="flex items-center gap-2"
                key={permission.user._id}
              >
                <UserAvatarAndName {...permission.user} className="grow" />
                <Select.Root
                  value={permission.level}
                  onValueChange={handlePermissionChange(permission)}
                >
                  <Select.Trigger
                    variant="text"
                    size="sm"
                    trailingClassName="-mr-1"
                    loading={
                      subProjectPermissionsUpdate.isPending &&
                      subProjectPermissionsUpdate.variables.userId ===
                        permission.user._id
                    }
                    readOnly={!canEdit}
                  />
                  <Select.Content>
                    <Select.Item value={PermissionLevel.READ}>
                      can view
                    </Select.Item>
                    <Select.Item value={PermissionLevel.WRITE}>
                      can collaborate
                    </Select.Item>
                    <Select.Item value={PermissionLevel.ADMIN}>
                      admin
                    </Select.Item>
                    {!permission.user.isMe && (
                      <Select.Item value="remove">remove</Select.Item>
                    )}
                  </Select.Content>
                </Select.Root>
              </div>
            ))}
            {teams?.map((permission) => (
              <div
                className="flex items-center gap-2"
                key={permission.team._id}
              >
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
                    loading={
                      subProjectPermissionsUpdate.isPending &&
                      subProjectPermissionsUpdate.variables.teamId ===
                        permission.team._id
                    }
                  />
                  <Select.Content>
                    <Select.Item value={PermissionLevel.READ}>
                      can view
                    </Select.Item>
                    <Select.Item value={PermissionLevel.WRITE}>
                      can collaborate
                    </Select.Item>
                    <Select.Item value="remove">remove</Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>
            ))}
          </div>
          {canEdit && (
            <Button
              onClick={handleResetToMainProjectPermissions}
              loading={subProjectPermissionsClear.isPending}
              size="sm"
            >
              Restore permissions from main project
            </Button>
          )}
        </>
      )}
    </div>
  );
}
